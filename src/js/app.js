App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
  
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }

    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('phonychain.json', function(data) {
      var Artifact = data;
      App.contracts.phonychain = TruffleContract(Artifact);
      App.contracts.phonychain.setProvider(App.web3Provider);
      return App.bindEvents();
    });

    
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handle);
  },


  handle: function(event) {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
  

      var account = accounts[0];
      buytoken = document.getElementById("token").value;
      var token =buytoken;
      App.contracts.phonychain.deployed().then(function(instance) {
        Instance = instance;
        return Instance.transfer("0xC868028aC3459a0d0FdA8B7ff0e4e5a231d2fFf1",token);
      }).then(function(result) {
          if(result){
          alert("토큰 충전에 성공했습니다.");
          coin = buytoken;
          document.location.href=`charge.html?PN=${buytoken}`;}
        return App.bindEvents();
      }).catch(function(err) {
        
      });
    });
      },
    
      
    
    };

$(function() {
  $(window).load(function() {
    App.init();

  });
});




