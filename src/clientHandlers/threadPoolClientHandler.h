#include "IClientHandler.h"
#include <mutex>
#include <atomic>
#include <vector>
#include <queue>
#include <condition_variable>
#include <thread>
#include <queue>

using namespace std;
#define MAX_CLIENTS_AT_ONCE 10

// Creating this "temporary" struct to pass the argument to the thread function safely
struct ArgsPtr {
    App* app;
};

// Thread pool client handler class definition
class ThreadPoolClientHandler : public IClientHandler {
    private:
        // Private fields for thread pool management
        vector<thread> threads;
        queue<ArgsPtr*> clients;
        mutex queueMutex;
        condition_variable condition;
        atomic<bool> stop;

        // Private methods for thread handling
        void clientHandler();
        void* handleClient(void* arg);

        // Private constructor and destructor for singleton pattern
        ThreadPoolClientHandler(size_t numThreads);
        ~ThreadPoolClientHandler();

    public:
        // Singleton instance accessor: creating the thread pool vector only once
        static ThreadPoolClientHandler& instance();
        // Creating a new client handler for a new client
        void createClientHandler(App* app) override;

        // Deleting copy constructor and assignment operator to prevent copies
        ThreadPoolClientHandler(const ThreadPoolClientHandler&) = delete;
        ThreadPoolClientHandler& operator=(const ThreadPoolClientHandler&) = delete;
};