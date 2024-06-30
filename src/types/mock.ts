import {
  EthSubscription,
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
} from './eip1193';

/**
 * MockProvider events.
 *
 * @description These are all the events including legacy events that
 * could be emitted by a provider. The events are emitted by the
 * MockProvider with the same arguments as specified in the EIP-1193
 * specification. Legacy events are marked as deprecated, but are
 * still emitted for backwards compatibility.
 *
 * @see https://eips.ethereum.org/EIPS/eip-1193#events
 */
export interface MockProviderEvents {
  connect: [connectInfo: ProviderConnectInfo];
  disconnect: [error: ProviderRpcError];
  chainChanged: [chainId: string];
  accountsChanged: [accounts: string[]];
  message: [message: EthSubscription | ProviderMessage];

  /**
   * @deprecated This event is superseded by `disconnect`.
   */
  close: [];
  /**
   * @deprecated This event is superseded by `chainChanged`.
   */
  networkChanged: [];
  /**
   * @deprecated This event is superseded by `message`.
   */
  notification: [];
}

/**
 * MockProvider event map.
 *
 * @description This is a type that maps the event names to their
 * respective argument types. This is used to type the event listeners
 * in the MockProvider, supplied to the EventEmitter type parameter.
 */
export type MockProviderEventMap = {
  [eventName in keyof MockProviderEvents]: MockProviderEvents[eventName];
};

export type MockProviderEventNames = keyof MockProviderEvents;

/**
 * MockProvider state.
 *
 * @description This is the state of the MockProvider instance. It
 * includes the accounts, chain ID, network version, and selected
 * address.
 */
export interface MockProviderState {
  /**
   * @var {boolean} connected
   *
   * Whether the provider is connected. The request stub will reject
   * if the provider is not connected with a ProviderRpcError and code
   * 4900 as per the specification.
   */
  connected: boolean;
  accounts: string[];
  /**
   * @var {string} chainId
   *
   * The chain ID of the connected network. The request stub will reject
   * if request is called but the chainId that the request parameters
   * specify does not match this chainId that the provider is connected to
   * with a ProviderRpcError and code 4901 as per the specification.
   */
  chainId: string;
  networkVersion: string;
  selectedAddress: string;
}

/**
 * @type MockListener<T>
 *
 * @description This is the typedef for the MockProvider's listener callback
 * on the `on` and `removeListener` methods.
 */
export type MockListener<T> = T extends MockProviderEventNames
  ? MockProviderEventMap[T] extends unknown[]
    ? (...args: MockProviderEventMap[T]) => void
    : never
  : never;
