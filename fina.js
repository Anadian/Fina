#!/usr/local/bin/node

const FileSystem = require('fs');
const CommandLineArguments = require('command-line-args');
const CommandLineUsage = require('command-line-usage');

/*types:
 * debit-purchase
 * credit-purchase
 * cash-purchase
 * payday
 * debit-to-credit-transfer
 * query
*/
const OptionDefinitions = [
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


