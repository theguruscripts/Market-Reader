# market-reader
This script can be used to calculate the total quantity of all buy & sell orders based on trader names.

***
## Installation
This is a nodejs based application.
```
npm install --save
```
***
## Configuration
```javascript
{
	"symbol" : "",                                            //Token Name - Example: SIM
	"ssc_api" : "https://api.hive-engine.com/rpc",            //Hive Engine RPC node
	"json_id" : "ssc-mainnet-hive",
	"limit" : 1000,                                           //Define the size of orders read in one time. Max 1000
	"decimal" : 1000,                                         //How many decimal places you want to see
	"he_buybook_setting" : {                                  //Hive-Engine market BUYBOOK setting    
		"contract" : "market",
		"table" : "buyBook"
	},
	"he_sellbook_setting" : {                                 //Hive-Engine market SELLBOOK setting 
		"contract" : "market",
		"table" : "sellBook"
	},
	"rpc_nodes" : [                                           //Hive RPC Nodes
		"https://api.deathwing.me",
		"https://hive.roelandp.nl",
		"https://api.openhive.network",
		"https://rpc.ausbit.dev",
		"https://hived.emre.sh",
		"https://hive-api.arcange.eu",
		"https://api.hive.blog",
		"https://api.c0ff33a.uk",
		"https://rpc.ecency.com",
		"https://anyx.io",
		"https://techcoderx.com",
		"https://hived.privex.io",		
		"https://api.pharesim.me"
	]
}
```
***
## Execute
```
node app.js
```
***
## Development
Encounter any issue or Bugs, Please report them [Here](https://github.com/theguruscripts/market-reader/issues).

Bot Developed by @theguruasia on HIVE.BLOG, @TheGuruAsia theguruasia#8947 on Discord.
