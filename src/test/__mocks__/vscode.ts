export const workspace = {
  rootPath: '/mock/root/path',
};

export const window = {
  showErrorMessage: jest.fn(),
  showInformationMessage: jest.fn(),
};

export const commands = {
  registerCommand: jest.fn(),
};

export const ExtensionContext = jest.fn().mockImplementation(() => ({
  subscriptions: [],
}));