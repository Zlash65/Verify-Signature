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
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
			web3 = new Web3(App.web3Provider);
		}

		return App.initContract();
	},

	initContract: function () {
		$.getJSON("Verify.json", function (verify) {
			//Instantiate a new truffle contract from the artifactes
			App.contracts.Verify = TruffleContract(verify);

			//Coonnect provider to intrect with contract
			App.contracts.Verify.setProvider(App.web3Provider);

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
		web3.personal.sign(web3.toHex(message), addr, (err, signature) => {
			$(".signed-by").val(addr);
			$(".signed-data").val(signature);
		})

	},

	verify: function (event) {
		event.preventDefault();

		var signed_data = $("#signed-message").val();
		var original_data = $("#original-message").val();
		var addr = web3.eth.accounts[0];



		// // sign original message to check if it matches with signed message
		// web3.personal.sign(web3.toHex(message),addr, (err,signature) => {
		// 	if(signature != signed_data) {
		// 		alert("Original message does not match with signed data");
		// 		return false;
		// 	}
		// })

		var signature = signed_data.substr(2); // remove 0x
		const r = '0x' + signature.slice(0, 64);
		const s = '0x' + signature.slice(64, 128);
		const v = '0x' + signature.slice(128, 130);
		const v_decimal = web3.toDecimal(v);

		App.contracts.Verify.deployed().then(instance => {
			var prefix_msg = `\x19Ethereum Signed Message:\n${original_data.length}${original_data}`;
			var prefix_msg_sha = web3.sha3(prefix_msg);

			return instance.recoverAddr.call(prefix_msg_sha, v_decimal, r, s);
		}).then(address => {
			$(".signed-by-2").val(address);
			console.log(address);

			var x = document.getElementById("snackbar");
			x.className = "show";

			if(address == addr) {
				x.innerHTML = "Verified";
			} else {
				x.innerHTML = "Data Mismatch";
			}
			setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
		}).catch(e => {
			console.log(e);
		})

		return false;
	}

};

$(function () {
	$(window).load(function () {
		App.init();
	});
});
