import { MockProvider } from '../src/MockProvider';

describe('MockProvider', () => {
  describe('Stub events', () => {
    it('should emit a connect event upon request', () => {
      const mockProvider = new MockProvider();
      const connectHandler = vi.fn();

      mockProvider.on('connect', connectHandler);

      mockProvider.emitConnect({ chainId: '0x1' });

      expect(connectHandler).toHaveBeenCalledWith({ chainId: '0x1' });

      mockProvider.removeListener('connect', connectHandler);
    });
  });
});
