const { Hive } = require('@splinterlands/hive-interface');
const fs = require('fs');
const colors = require('colors');
const config = require('./config.json');
const { HiveEngine } = require('@splinterlands/hive-interface');
let hive_engine = new HiveEngine();

const sscjs = require('sscjs');
var sscString = config.ssc_api;
var ssc = new sscjs(sscString);

const hive = new Hive({
  logging_level: 0,
  rpc_nodes: config.rpc_nodes
});

const TOKENSYMBOL = config.symbol;
const JSONID = config.json_id;
var LIMIT = config.limit;
LIMIT = parseInt(LIMIT) || 0;
var DECIMAL = config.decimal;
DECIMAL = parseInt(DECIMAL) || 0;

const BUYBOOKCONTRACT = config.he_buybook_setting.contract;
const BUYBOOKTABLE = config.he_buybook_setting.table;
const SELLBOOKCONTRACT = config.he_sellbook_setting.contract;
const SELLBOOKTABLE = config.he_sellbook_setting.table;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const tokenOrderProcess = async() => {
	try
	{
		var buyBookData = await buyBookProcess();
		console.log(TOKENSYMBOL.yellow, "TOTAL BUY QTY : ".green, buyBookData);
		console.log("-----------------------------------------------------".red);
		var sellBookData = await sellBookProcess();
		console.log(TOKENSYMBOL.yellow, "TOTAL SELL QTY : ".green, sellBookData);
	}
	catch(error)
	{
		console.log("Error at tokenOrderProcess() : ", error);
	}
};

// Read Total Buy Orders & Calculate The Quantity Based On HIVE Account Name
const buyBookProcess = async() => {
	var buyBookArray = [];
	try
	{		
		var buyBookData = await processBuyBookOrders();
		if(buyBookData.length > 0)
		{
			var finalList = buyBookData.reduce((c, v) => {			
				c[v.account] = (c[v.account] || 0) + parseFloat(v.quantity);					
				return c;
			}, {});
			
			
			for(var i in finalList)
			{
				var qty = Math.floor(finalList[i] * DECIMAL) / DECIMAL;
				var ddata = {
					"name" : i,
					"qty" : qty
				}				
				buyBookArray.push(ddata);
			}			
			buyBookArray.sort(function(a, b) 
			{			
				return parseFloat(b.qty) - parseFloat(a.qty);				
			});			
		}
		return buyBookArray;	
	}
	catch(error)
	{
		console.log("Error at buyBookProcess() : ", error);
		return buyBookArray;
	}
};

const processBuyBookOrders = async() => {	
	var buyBookOrders = [];		
	try
	{	
		async function recursive(INDEX)
		{
			try
			{
				var orderData = await ssc.find(BUYBOOKCONTRACT, BUYBOOKTABLE, {symbol: TOKENSYMBOL}, LIMIT, INDEX, []);
				if(orderData.length > 0)
				{
					console.log('RETRIEVING BUYBOOK ORDERS...'.green);
					orderData.forEach(function(balance) 
					{
						buyBookOrders.push(balance);
					});		
					await recursive(INDEX + 1000);
				}
				else
				{
					console.log('');
					console.log('STARTED BUYBOOK ORDER SORTING...'.green);	
					buyBookOrders.sort(function(a, b) 
					{			
						return parseFloat(b.price) - parseFloat(a.price);				
					});	
					console.log('ORDERS HAVE BEEN SORTED'.blue);
					console.log('TOTAL ORDERS : '.yellow, buyBookOrders.length);
				}
			}
			catch(error)
			{
				console.log("Error at recursive() : ", error);
			}
		}
		await recursive(0);
		return buyBookOrders;	
	}
	catch(error)
	{
		console.log("Error at processBuyBookOrders() : ", error);
		return buyBookOrders;
	}
};

// Read Total Sell Orders & Calculate The Quantity Based On HIVE Account Name
const sellBookProcess = async() => {
	var sellBookArray = [];
	try
	{		
		var sellBookData = await processSellBookOrders();
		if(sellBookData.length > 0)
		{
			var finalList = sellBookData.reduce((c, v) => {			
				c[v.account] = (c[v.account] || 0) + parseFloat(v.quantity);					
				return c;
			}, {});
			
			
			for(var i in finalList)
			{
				var qty = Math.floor(finalList[i] * DECIMAL) / DECIMAL;
				var ddata = {
					"name" : i,
					"qty" : qty
				}				
				sellBookArray.push(ddata);
			}			
			sellBookArray.sort(function(a, b) 
			{			
				return parseFloat(b.qty) - parseFloat(a.qty);				
			});			
		}
		return sellBookArray;	
	}
	catch(error)
	{
		console.log("Error at sellBookProcess() : ", error);
		return sellBookArray;
	}
};

const processSellBookOrders = async() => {	
	var sellBookOrders = [];		
	try
	{	
		async function recursive(INDEX)
		{
			try
			{
				var orderData = await ssc.find(SELLBOOKCONTRACT, SELLBOOKTABLE, {symbol: TOKENSYMBOL}, LIMIT, INDEX, []);
				if(orderData.length > 0)
				{
					console.log('RETRIEVING SELLBOOK ORDERS...'.green);
					orderData.forEach(function(balance) 
					{
						sellBookOrders.push(balance);
					});		
					await recursive(INDEX + 1000);
				}
				else
				{
					console.log('');
					console.log('STARTED SELLBOOK ORDER SORTING...'.green);	
					sellBookOrders.sort(function(a, b) 
					{			
						return parseFloat(b.price) - parseFloat(a.price);				
					});	
					console.log('ORDERS HAVE BEEN SORTED'.blue);
					console.log('TOTAL ORDERS : '.yellow, sellBookOrders.length);
				}
			}
			catch(error)
			{
				console.log("Error at recursive() : ", error);
			}
		}
		await recursive(0);
		return sellBookOrders;	
	}
	catch(error)
	{
		console.log("Error at processSellBookOrders() : ", error);
		return sellBookOrders;
	}
};

tokenOrderProcess();

