#!/usr/local/bin/node

const FileSystem = require('fs');
const Path = require('path');
const OperatingSystem = require('os');

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
	{name: 'help', alias: 'h', type: Boolean, description: 'Display this help text and exit.'},
	{name: 'version', alias: 'V', type: Boolean, description: 'Display version information and exit.'},
	{name: 'verbose', alias: 'v', type: Boolean, description: 'Verbose printing to stdout.'},
	{name: 'file', alias: 'f', type: String, description: 'The JSON file to use.'},
	{name: 'directory', alias: 'R', type: String, description: 'The base directory to store files; defaults to "$HOME/fina"'},
	{name: 'date', alias: 'd', type: String, description: 'The date; defaults to current date.'},
	{name: 'merchant', alias: 'm', type: String},
	{name: 'order', alias: 'o', type: String},
	{name: 'cost', alias: 'c', type: Number},
	{name: 'type', alias: 't', type: String, description: 'Type of transaction: debit, credit, cash, et cetera.'},
	{name: 'preconverted', alias: 'P', Number},
	{name: 'estimated-arrival', alias: 'E', type: String, description: 'Estimated Arrival date; defaults to transaction date.'},
	{name: 'arrival', alias: 'A', type: String, description: 'Actual Arrival date; defaults to transaction date.'},
	{name: 'have', alias: 'n', type: Boolean},
	{name: 'payed', alias: 'p', type: Boolean},
	{name: 'refunded', alias: 'r', type: Boolean},
	{name: 'tags', alias: 'T', type: String},
	{name: 'notes', alias: 'N', type: String}
];

if(require.main === module){
	const Options = CommandLineArguments(OptionDefinitions);
	if(Options.help != null){
		console.log(CommandLineUsage(OptionDefinitions));
	} else if(Options.versions != null){
		console.log(FINA_VERSION);
	} else{
		var file_data = null;
		var json_object = {purchases: []};
		
		var filename = null;
		//File stuff
		if(Options.file != null) filename = Options.file;
		else{
			var home_directory = OperatingSystem.homedir();
			var date_object = new Date();
			var year_number = date_object.getUTCFullYear();
			var month_number = date_object.getUTCMonth()+1;
			var fina_directory = null;
			if(Options.directory != null) fina_directory = Options.directory;
			else fina_directory = Path.join(home_directory,'fina');
			if(FileSystem.existsSync(fina_directory) === false) FileSystem.mkdirSync(fina_directory);
			var year_directory = Path.join(fina_directory,year_number.toString());
			if(FileSystem.existsSync(year_directory) === false) FileSystem.mkdirSync(year_directory);
			filename = Path.join(year_directory,month_number.toString(),'.json');
		}
		if(FileSystem.existsSync(filename) === true){
			file_data = FileSystem.readFileSync(filename, 'utf8');
			json_object = ParseJSON(file_data, filename);
		}
		//Preparing purchase
		var purchase = {
			id: NanoID(),
			date: date_object.toISOString(),
			merchant: null,
			order: null,
			cost: 0,
			type: "debit",
			preconverted: null,
			estimated_arrival: null,
			arrival: null,
			have: false,
			payed: false,
			refunded: false,
			tags: null,
			notes: null
		};
		//optfills
		if(Options.date != null) purchase.date = Options.date;
		if(Options.merchant != null) purchase.merchant = Options.merchant;
		if(Options.order != null) purchase.order = Options.order;
		if(Options.cost != null) purchase.cost = Options.cost;
		if(Options.type != null) purchase.type = Options.type;
		if(Options.preconverted != null) purchase.preconverted = Options.preconverted;
		if(Options.estimated_arrival != null) purchase.estimated_arrival = Options.estimated_arrival;
		if(Options.arrival != null) purchase.arrival = Options.arrival;
		if(Options.have != null) purchase.have = !(Options.have);
		if(Options.payed != null) purchase.payed = Options.payed;
		if(Options.refunded != null) purchase.refunded = Options.refunded;
		if(Options.tags != null) purchase.tags = Options.tags;
		if(Options.notes != null) purchase.notes = Options.notes;
		//JSON stuff
		json_object.purchases.push(purchase);
		file_data = JSON.stringify(json_object, null, '\t');
		FileSystem.writeFileSync(filename, file_data, 'utf8');
	}
}
