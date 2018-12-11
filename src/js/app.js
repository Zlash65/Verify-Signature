App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',

	init: function () {
		return App.initWeb3();
	},

	initWeb3: function () {
		// TODO: refactor conditional
		if (typeof web3 !== 'undefined') {
			// If a web3 instance is already provided by Meta Mask.
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			// Specify default instance if no web3 instance provided
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
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

	toHex: function (str) {
		var hex = ''
		for (var i = 0; i < str.length; i++) {
			hex += '' + str.charCodeAt(i).toString(16)
		}
		return hex
	},

	sign: function (event) {
		event.preventDefault();
		var message = $('#message').val();
		var addr = web3.eth.accounts[0];

		// var signature = web3.eth.sign(addr, '0x' + web3.toHex(message));
		web3.personal.sign(web3.toHex(message),addr, (err,signature) => {
			$(".signed-by").val(addr);
			$(".signed-data").val(signature);
		})

	}

};

$(function () {
	$(window).load(function () {
		App.init();
	});
});
