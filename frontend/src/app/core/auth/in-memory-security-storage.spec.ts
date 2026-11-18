import { InMemorySecurityStorage } from './in-memory-security-storage';

describe('InMemorySecurityStorage', () => {
  it('stores security values without writing to localStorage', () => {
    const storage = new InMemorySecurityStorage();
    const localStorageSpy = vi.spyOn(localStorage, 'setItem');

    storage.write('access_token', 'test-secret');

    expect(storage.read('access_token')).toBe('test-secret');
    expect(localStorageSpy).not.toHaveBeenCalled();

    storage.remove('access_token');
    expect(storage.read('access_token')).toBeNull();
  });
});
