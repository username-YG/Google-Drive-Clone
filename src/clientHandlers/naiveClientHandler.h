#include "IClientHandler.h"
#include <pthread.h>

class NaiveClientHandler : public IClientHandler {
    public:
        void createClientHandler(App* app) override;
};