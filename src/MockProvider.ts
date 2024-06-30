import { EventEmitter } from 'events';

import {
  EIP1193Provider,
  EthSubscription,
  ProviderConnectInfo,
  ProviderDeprecatedError,
  ProviderMessage,
  ProviderRpcError,
  RequestArguments,
} from './types/eip1193';

import {
  MockListener,
  MockProviderEventMap,
  MockProviderEventNames,
  MockProviderEvents,
  MockProviderState,
} from './types/mock';

/**
 * MockProvider class implementing the Ethereum Provider JavaScript API (EIP-1193)
 *
 * @description This class is a mock implementation of the Ethereum Provider
 * JavaScript API. It is intended for use in testing and development environments.
 * It is not intended to be used in production applications.
 *
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */
export class MockProvider
  /**
   * @see https://eips.ethereum.org/EIPS/eip-1193#events
   */
  extends EventEmitter<MockProviderEventMap>
  implements EIP1193Provider
{
  public _internalState: MockProviderState = {
    connected: false,
    accounts: [],
    chainId: '0x1',
    networkVersion: '1',
    selectedAddress: '',
  };

  /**
   * A map of deprecated events to their replacements.
   * This is used to throw a warning when a deprecated event is listened to.
   */
  public static deprecatedEventMap = new Map<
    keyof MockProviderEvents,
    keyof MockProviderEvents
  >([
    ['close', 'disconnect'],
    ['networkChanged', 'chainChanged'],
    ['notification', 'message'],
  ]);

  /**
   * Makes an Ethereum RPC method call.
   * @param args - The request arguments
   * @returns A Promise that resolves with the method's result or
   *          rejects with a ProviderRpcError
   *
   * @description
   * "The Provider MUST identify the requested RPC method by the value of
   * RequestArguments.method. If the requested RPC method takes any parameters,
   * the Provider MUST accept them as the value of RequestArguments.params.
   * RPC requests MUST be handled such that the returned Promise either resolves
   * with a value per the requested RPC method's specification, or rejects with
   * an error."
   */
  async request(args: RequestArguments): Promise<unknown> {
    // Author Note: This is a mock implementation. It does not actually make RPC calls.
    console.log(`request: ${JSON.stringify(args)}`);

    return await Promise.resolve(null);
  }

  // Author Note: In the wild, some Providers are EventEmitters and some aren't.
  // This means only these two methods as defined in EIP-1193 can be trusted to
  // always exist. The rest of the methods are up to the implementer.
  //
  // For MockProvider, these methods are implemented by extending EventEmitter
  // and their implementation are stubbed out below in a type-safe manner.

  on<T extends MockProviderEventNames>(
    event: T,
    listener: MockListener<T>
  ): this {
    if (MockProvider.deprecatedEventMap.has(event)) {
      console.warn(`[deprecated] ${event}`);
      throw new ProviderDeprecatedError(
        `Event ${event} is deprecated. Use \`${MockProvider.deprecatedEventMap.get(event)}\` instead.`
      );
    }

    return super.on<T>(event, listener);
  }

  removeListener<T extends MockProviderEventNames>(
    event: T,
    listener: MockListener<T>
  ): this {
    return super.removeListener<T>(event, listener);
  }

  /**
   * @deprecated This method is superseded by `request`.
   *
   * @description
   * "sendAsync is like request, but with JSON-RPC objects and a callback."
   */
  sendAsync(
    request: unknown,
    callback: (error: Error | null, response: unknown) => void
  ): void {
    console.warn(
      `[deprecated] sendAsync: {request: ${JSON.stringify(request)}, callback: ${callback?.name ?? callback?.constructor?.name ?? 'anonymous'}}`
    );
    throw new ProviderDeprecatedError('This method is superseded by `request`');
  }

  /**
   * @deprecated This method is superseded by `request`.
   *
   * @description
   * "This method is superseded by request."
   */
  send(...args: unknown[]): unknown {
    console.warn(`[deprecated] send: ${JSON.stringify(args)}`);
    throw new ProviderDeprecatedError('This method is superseded by `request`');
  }

  /**
   * Note: The following methods are not part of the EIP-1193 standard.
   */

  emitConnect(connectInfo: ProviderConnectInfo): void {
    this.emit('connect', connectInfo);
  }

  emitDisconnect(error: ProviderRpcError): void {
    this.emit('disconnect', error);
  }

  emitChainChanged(chainId: string): void {
    this.emit('chainChanged', chainId);
  }

  emitAccountsChanged(accounts: string[]): void {
    this.emit('accountsChanged', accounts);
  }

  emitMessage(message: EthSubscription | ProviderMessage): void {
    this.emit('message', message);
  }

  /**
   * @deprecated This event is superseded by `disconnect`.
   */
  emitClose(): void {
    console.warn('[deprecated] emitClose');
    this.emitMessage({
      type: 'eth_subscription',
      data: 'close',
    });
    throw new ProviderDeprecatedError(
      '`close` event is deprecated. Use `disconnect` instead.'
    );
  }

  /**
   * @deprecated This event is superseded by `chainChanged`.
   */
  emitNetworkChanged(): void {
    throw new ProviderDeprecatedError(
      '`networkChanged` event is deprecated. Use `chainChanged` instead.'
    );
  }

  /**
   * @deprecated This event is superseded by `message`.
   */
  emitNotification(): void {
    throw new ProviderDeprecatedError(
      '`notification` event is deprecated. Use `message` instead.'
    );
  }
}
