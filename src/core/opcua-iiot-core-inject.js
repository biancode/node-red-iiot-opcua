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
 * @type {{biancoroyal: {opcua: {iiot: {core: {inject: {}}}}}}}
 *
 * @Namesapce de.biancoroyal.opcua.iiot.core.inject
 */
var de = de || {biancoroyal: {opcua: {iiot: {core: {inject: {}}}}}} // eslint-disable-line no-use-before-define
de.biancoroyal.opcua.iiot.core.inject.core = de.biancoroyal.opcua.iiot.core.inject.core || require('./opcua-iiot-core') // eslint-disable-line no-use-before-define
de.biancoroyal.opcua.iiot.core.inject.internalDebugLog = de.biancoroyal.opcua.iiot.core.inject.internalDebugLog || require('debug')('opcuaIIoT:inject') // eslint-disable-line no-use-before-define

module.exports = de.biancoroyal.opcua.iiot.core.inject
