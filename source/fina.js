#!/usr/local/bin/node

const FileSystem = require('fs');
const CommandLineArguments = require('command-line-args');
const CommandLineUsage = require('command-line-usage');
const NanoID = require('nanoid');
const ParseJSON = require('parse-json');
//const LevelDown = require('leveldown');
//const LevelUp = require('levelup');

/*types:
 * debit-purchase
 * credit-purchase
 * cash-purchase
 * payday
 * debit-to-credit-transfer
 * query
*/
const OptionDefinitions = [
	{name: 'file', alias: 'f', type: String, description: 'The JSON file to use.'},
	{name: 'date', alias: 'd', type: String, description: 'The date; defaults to current date.'},
	{name: 'merchant', alias: 'm', type: String},
	{name: 'order', alias: 'o', type: String},
	{name: 'net-effect', alias: 'n', type: Number},
	{name: 'type', alias: 't', type: String},
	{name: 'preconverted', alias: 'P', Number},
	{name: 'estimated-arrival', alias: 'e', type: String, description: 'Estimated Arrival date; defaults to transaction date.'},
	{name: 'have', alias: 'h', type: Boolean},
	{name: 'payed', alias: 'p', type: Boolean},
	{name: 'refunded', alias: 'r', type: Boolean},
	{name: 'tags', alias: 'T', type: String},
	{name: 'query', alias: 'q', type: Boolean}
];

if(require.main === module){
	const Options = CommandLineArguments(OptionDefinitions);
	//File stuff
	console.dir(Date);
	var date_object = new Date();
	var year_number = date_object.getUTCFullYear();
	var month_number = date_object.getUTCMonth()+1;
	var filename = '/Users/cameron/fina/'+year_number.toString()+'/'+month_number.toString()+'.json';
	var file_data = FileSystem.readFileSync(filename, 'utf8');
	var json_object = ParseJSON(file_data, filename);
	//Preparing item
	var item = {
		id: NanoID(),
		date: date_object.toISOString(),
		merchant: null,
		order: null,
		net_effect: 0,
		type: "debit",
		preconverted: null,
		estimated_arrival: null,
		have: false,
		payed: false,
		refunded: false,
		tags: null
	};
	//optfills
	if(Options.date != null) item.date = Options.date;
	if(Options.merchant != null) item.merchant = Options.merchant;
	if(Options.order != null) item.order = Options.order;
	if(Options.net_effect != null) item.net_effect = Options.net_effect;
	if(Options.type != null) item.type = Options.type;
	if(Options.preconverted != null) item.preconverted = Options.preconverted;
	if(Options.estimated_arrival != null) item.estimated_arrival = Options.estimated_arrival;
	if(Options.have != null) item.have = Options.have;
	if(Options.payed != null) item.payed = Options.payed;
	if(Options.refunded != null) item.refunded = Options.refunded;
	if(Options.tags != null) item.tags = Options.tags;
	//JSON stuff
	if(json_object.items === undefined) json_object.items = [];
	json_object.items.push(item);
	file_data = JSON.stringify(json_object, null, '\t');
	FileSystem.writeFileSync(filename, file_data, 'utf8');
}
