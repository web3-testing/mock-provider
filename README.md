# @web3-testing/mock-provider

[![Test](https://github.com/web3-testing/mock-provider/actions/workflows/test.yml/badge.svg)](https://github.com/web3-testing/mock-provider/actions/workflows/test.yml)

A partially stubbed MockProvider class for unit testing web3 EIP-1193 compatible providers, wallets and dapps.

## Installation

```bash
yarn add -D @web3-testing/mock-provider

# or

npm install --save-dev @web3-testing/mock-provider
```

## Usage

```typescript
import { MockProvider } from '@web3-testing/mock-provider';

describe('MockProvider', () => {
  let provider: MockProvider;

  beforeEach(() => {
    provider = new MockProvider();
  });

  it('should emit a connect event at will', async () => {
    provider = new MockProvider();

    provider.on('connect', () => {
      expect(true).toBe(true);
    });

    provider.emitConnect();
  });
});
```

```typescript
import { MockProvider } from '@web3-testing/mock-provider';
import { Connector } from 'wagmi';

describe('Connector', () => {
  let connector: CreateConnectorFn;

  beforeEach(() => {
    connector = {
      // ...
      getProvider: () => mockProvider,
      // ...
    };
  });

  it('should connect to the provider', async () => {
    let wagmiConfig = createConfig({
      multiInjectedProviderDiscovery: false,
      ssr: false,
      chains: [sepolia],
      connectors: [connector],
      transports: {
        [sepolia.id]: http(),
      },
    });

    provider.emitConnect();

    expect(wagmiConfig.state.status).toBe('connected');
  });
});
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Support

If you like this project, please consider donating to the following address:
Thank you!

| Address                                      | Network                                      |
| -------------------------------------------- | -------------------------------------------- |
| `0x63a01150A843a4468BEcf8C7590b3eC757a62945` | Ethereum / Arbitrum / Polygon / Optimism etc |

## Unit Tests

```bash
yarn test
```

## Authors

- [Robin Duckett](robin@diod.es)

## License

MIT
