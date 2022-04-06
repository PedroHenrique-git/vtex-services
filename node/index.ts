import {
  LRUCache, method, ParamsContext,
  RecorderState, Service,
  ServiceContext
} from '@vtex/api';
import { Clients } from './clients';
import { updateLiveUsers } from './event/liveUsersUpdate';
import { analytics } from './handlers/analytics';
import productList from './resolvers/product';

const THREE_SECONDS_MS = 3 * 1000
const CONCURRENCY = 10

const memoryCache = new LRUCache<string, any>({ max: 5000 })
metrics.trackCache('status', memoryCache)

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 2,
        timeout: 10000,
      },
      events:  {
        exponentialTimeoutCoefficient: 2,
        exponentialBackoffCoefficient: 2,
        initialBackoffDelay: 50,
        retries: 1,
        timeout: THREE_SECONDS_MS,
        concurrency: CONCURRENCY,
      }
    },
  },
  routes: {
    analytics: method({
      GET: [analytics],
    }),
  },
  events: {
    liveUserUpdate: updateLiveUsers,
  },
  graphql: {
    resolvers: {
      Query: {
        productList
      }
    }
  }
})
