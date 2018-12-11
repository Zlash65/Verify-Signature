App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',

	init: function () {
		return await App.initWeb3();
	},

	initWeb3: async function () {
		// TODO: refactor conditional
		if (typeof web3 !== 'undefined') {
			// If a web3 instance is already provided by Meta Mask.
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			// Specify default instance if no web3 instance provided
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
			web3 = new Web3(App.web3Provider);
		}

		return App.initContract();
	},

	initContract: function () {
		$.getJSON("Verify.json", function (verifier) {
			//Instantiate a new truffle contract from the artifactes
			App.contracts.Verifier = TruffleContract(verifier);

			//Coonnect provider to intrect with contract
			App.contracts.Verifier.setProvider(App.web3Provider);

		});
	},

};

$(function () {
	$(window).load(function () {
		App.init();
	});
});
