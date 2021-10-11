module.exports = {
    token: "bogustoken", 
    authenticated: false,
    loadUserProfile: jest.fn( ()=> ({ then: jest.fn() })),
    login: jest.fn()
};
