import { EventEmitter } from 'stream';

type CloseEventCode = CloseEvent['code'];

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export class ProviderRpcError extends Error {
  code: CloseEventCode;
  data?: unknown;

  constructor(message: string, code: CloseEventCode, data?: unknown) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

export class ProviderDeprecatedError extends Error {}

export interface ProviderMessage {
  readonly type: string;
  readonly data: unknown;
}

export interface ProviderConnectInfo {
  readonly chainId: string;
}

export interface EthSubscription extends ProviderMessage {
  readonly type: 'eth_subscription';
  readonly data: {
    readonly subscription: string;
    readonly result: unknown;
  };
}

export interface EIP1193Provider extends EventEmitter {
  request(args: RequestArguments): Promise<unknown>;
}
