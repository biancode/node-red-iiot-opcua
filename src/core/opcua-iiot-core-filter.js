/**
 The BSD 3-Clause License

 Copyright 2016,2017 - Klaus Landsdorf (http://bianco-royal.de/)
 All rights reserved.
 node-red-iiot-opcua
 */
'use strict'

/**
 * Nested namespace settings.
 *
 * @type {{biancoroyal: {opcua: {iiot: {core: {filter: {}}}}}}}
 *
 * @Namesapce de.biancoroyal.opcua.iiot.core.filter
 */
var de = de || {biancoroyal: {opcua: {iiot: {core: {filter: {}}}}}} // eslint-disable-line no-use-before-define
de.biancoroyal.opcua.iiot.core.filter.core = de.biancoroyal.opcua.iiot.core.filter.core || require('./opcua-iiot-core') // eslint-disable-line no-use-before-define
de.biancoroyal.opcua.iiot.core.filter.internalDebugLog = de.biancoroyal.opcua.iiot.core.filter.internalDebugLog || require('debug')('opcuaIIoT:filter') // eslint-disable-line no-use-before-define

module.exports = de.biancoroyal.opcua.iiot.core.filter
