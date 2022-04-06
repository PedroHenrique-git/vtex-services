import { IOClients } from '@vtex/api';
import Analytics from './analytics';
export class Clients extends IOClients {
    public get analytics() {
        return this.getOrSet('analytics', Analytics);
    }
}
