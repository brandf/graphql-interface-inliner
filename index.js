#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const program = require('commander');
const clone = require('clone');
const flatmap = require('flatmap');
const { parse, print, buildASTSchema, printSchema, visit, Kind } = require('graphql');

program
.version('0.1.0')
.usage('[options] <file>')
.description('inlines interface definitions into type definitions')
.option('-i, --input', 'Print the input schema')
.option('-a, --ast', 'Print the input ast')
.option('-o, --outast', 'Print the output ast')
.parse(process.argv);

if (program.args && program.args.length === 1) {
    const schemaText = fs.readFileSync(program.args[0], { encoding: "utf8" });
    const ast = parse(schemaText);

    if (program.schema) {
        console.log(schemaText);
        return;
    }
    if (program.ast) {
        console.log(util.inspect(ast, false, null));
        return;
    }

    // find all interfaces
    const interfaceMap = {};
    visit(ast, {
        'InterfaceTypeDefinition': function (node) {
            interfaceMap[node.name.value] = node;
        }
    });

    // find all types and inject interface definitions
    const outast = visit(ast, {
        'ObjectTypeDefinition': function (node) {
            const interfaceDefinitions = flatmap(node.interfaces, function (interfaceNode) { return interfaceMap[interfaceNode.name.value].fields; });
            node.fields = interfaceDefinitions.concat(node.fields);
            return node;
        }
    });

    if (program.outast) {
        console.log(util.inspect(outast, false, null));
        return;
    }

    console.log(print(outast));
} else {
    program.outputHelp();
    process.exit(1);
}