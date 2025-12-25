#include "threadPoolClientHandler.h"
#include "../App.h"

// The function each thread executes to handle clients
void ThreadPoolClientHandler::clientHandler() {
    while (true) {
        ArgsPtr* argsPtr;
        {
            // Locking the queue to access clients
            unique_lock<mutex> lock(queueMutex);
            // Waiting until there is a client to handle or stop is signaled
            condition.wait(lock, [this]() { return stop || !clients.empty(); });

            // If stop is signaled and there are no more clients - then stop
            if (stop && clients.empty())
                return;

            // Getting the next client to handle
            argsPtr = clients.front();
            // Removing the client from the queue
            clients.pop();
        }

        // Handling the client outside the critical section
        handleClient(argsPtr);
    }
}

// The function the thread executes to handle the communication with the client
void* ThreadPoolClientHandler::handleClient(void* arg) {
    // Casting the argument back to ArgsPtr
    ArgsPtr* argsPtr = (ArgsPtr*)arg;
    // Running the app to start and handle the communication
    argsPtr->app->run();

    // Cleaning up allocated memory
    delete argsPtr->app;
    delete argsPtr;
    return NULL;
}
    
// Initialize the thread pool with a specific number of worker threads
ThreadPoolClientHandler::ThreadPoolClientHandler(size_t numThreads) : stop(false) {
    for (size_t i = 0; i < numThreads; ++i) {
        // Specifying that each thread will execute the clientHandler function
        threads.emplace_back([this]() { ThreadPoolClientHandler::clientHandler(); });
    }
}

// Deconstructor to clean up the threads of the thread pool
ThreadPoolClientHandler::~ThreadPoolClientHandler() {
    {
        // Locking the queue to set the stop flag
        unique_lock<mutex> lock(queueMutex);
        // Setting the stop flag to true to signal threads to finish
        stop = true;
    }

    // Notifying all threads to wake up and finish
    condition.notify_all();
    for (thread &thread : threads) {
        if (thread.joinable()) {
            thread.join();
        }
    }
}

// Singleton instance accessor: creating the thread pool vector only once
ThreadPoolClientHandler& ThreadPoolClientHandler::instance(int numThreads) {
    // Static instance of the ThreadPoolClientHandler
    static ThreadPoolClientHandler instance(numThreads);
    return instance;
}

// Creating a new client handler for a new client
void ThreadPoolClientHandler::createClientHandler(App* app) {
    // Getting the singleton instance of the ThreadPoolClientHandler
    // ThreadPoolClientHandler& instance = ThreadPoolClientHandler::instance(int numThreads);
    {
        // Locking the queue and adding a new client
        unique_lock<mutex> lock(this->queueMutex);
        ArgsPtr* argsPtr = new ArgsPtr();
        argsPtr->app = app;
        this->clients.push(argsPtr);
    }
    // Notifying one thread that a new client is available
    this->condition.notify_one();
}