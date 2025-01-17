/**
 * Original Work Copyright 2014 IBM Corp.
 * node-red
 *
 * Copyright (c) 2022 DATATRONiQ GmbH (https://datatroniq.com)
 * Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 * All rights reserved.
 * node-red-contrib-iiot-opcua
 *
 **/

'use strict'

// jest.setTimeout(30000)

var injectNodeRedNode = require('@node-red/nodes/core/common/20-inject')
var functionNodeRedNode = require('@node-red/nodes/core/function/10-function')

// iiot opcua
var injectNode = require('../../src/opcua-iiot-inject')
var connectorNode = require('../../src/opcua-iiot-connector')
var inputNode = require('../../src/opcua-iiot-write')
var responseNode = require('../../src/opcua-iiot-response')
var serverNode = require('../../src/opcua-iiot-server')

var helper = require('node-red-node-test-helper')
var portHelper = require('./../helper/test-helper-extensions')
helper.init(require.resolve('node-red'))

var writeNodesToLoad = [injectNodeRedNode, injectNode, functionNodeRedNode, connectorNode, inputNode, responseNode, serverNode]

var testFlows = require('./flows/write-e2e-flows')
const { StatusCodes } = require('node-opcua')

let testingOpcUaPort = 0

describe('OPC UA Write node e2e Testing', function () {

  beforeAll(() => {
    testingOpcUaPort = 56500
  })

  beforeEach(function (done) {
    helper.startServer(function () {
      done()
    })
  })

  afterEach(function (done) {
    helper.unload().then(function () {
      helper.stopServer(function () {
        done()
      })
    }).catch(function () {
      helper.stopServer(function () {
        done()
      })
    })
  })

  describe('Write node', function () {
    it('should be loaded and live with server', function (done) {
      const flow = Array.from(testFlows.testWriteNodeToBeLoadedWithServer)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[2].port = port
      flow[4].endpoint = 'opc.tcp://localhost:' + port
      helper.load([inputNode, serverNode, connectorNode], flow,
        function () {
          let nodeUnderTest = helper.getNode('34d2c6bc.43275b')
          expect(nodeUnderTest.name).toBe('TestWrite')
          expect(nodeUnderTest.showErrors).toBe(true)
          expect(nodeUnderTest.justValue).toBe(false)
          done()
        })
    })

    it('should get a message with payload from inject node', function (done) {
      const flow = Array.from(testFlows.testWriteFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[9].port = port
      flow[10].endpoint = 'opc.tcp://localhost:' + port
      helper.load(writeNodesToLoad, flow, function () {
        let n2 = helper.getNode('n2wrf1')
        let n1 = helper.getNode('n1wrf1')
        n2.on('input', function (msg) {
          expect(msg.payload.value).toBe(12345.67)
          expect(msg.topic).toBe('TestTopicWrite')
          done()
        })
      })
    })

    it('should verify addressSpaceItems', function (done) {
      const flow = Array.from(testFlows.testWriteFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[9].port = port
      flow[10].endpoint = 'opc.tcp://localhost:' + port
      helper.load(writeNodesToLoad, flow, function () {
        let n2 = helper.getNode('n2wrf1')
        n2.on('input', function (msg) {
          expect(msg.payload.addressSpaceItems).toMatchObject([{
            'name': 'TestReadWrite',
            'nodeId': 'ns=1;s=TestReadWrite',
            'datatypeName': 'Double'
          }])
          done()
        })
      })
    })

    it('should have values to write', function (done) {
      const flow = Array.from(testFlows.testWriteFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[9].port = port
      flow[10].endpoint = 'opc.tcp://localhost:' + port
      helper.load(writeNodesToLoad, flow, function () {
        let n4 = helper.getNode('n4wrf1')
        n4.on('input', function (msg) {
          expect(msg.payload.addressSpaceItems).toMatchObject([{
            name: 'TestReadWrite',
            nodeId: 'ns=1;s=TestReadWrite',
            datatypeName: 'Double'
          }])
          expect(msg.payload.valuesToWrite[0]).toBe(12345.22)
          expect(msg.topic).toBe('TestTopicWrite')
          expect(msg.payload.nodetype).toBe('inject')
          expect(msg.payload.injectType).toBe('write')
          done()
        })
      })
    })

    it('should have write results', function (done) {
      const flow = Array.from(testFlows.testWriteFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[9].port = port
      flow[10].endpoint = 'opc.tcp://localhost:' + port
      helper.load(writeNodesToLoad, flow, function () {
        let n6 = helper.getNode('n6wrf1')
        n6.on('input', function (msg) {
          expect(msg.payload.addressSpaceItems).toMatchObject([{
            'name': 'TestReadWrite',
            'nodeId': 'ns=1;s=TestReadWrite',
            'datatypeName': 'Double'
          }])
          expect(msg.payload.value.statusCodes).toBeDefined()
          expect(msg.payload.value.statusCodes?.length).toBeGreaterThan(0)
          expect(msg.payload.value.statusCodes[0]).toMatchObject(StatusCodes.Good)
          expect(msg.topic).toBe('TestTopicWrite')
          expect(msg.payload.nodetype).toBe('write')
          expect(msg.payload.injectType).toBe('write')
          done()
        })
      })
    })

    it('should have write results with response', function (done) {
      const flow = Array.from(testFlows.testWriteFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[9].port = port
      flow[10].endpoint = 'opc.tcp://localhost:' + port
      helper.load(writeNodesToLoad, flow, function () {
        let n8 = helper.getNode('n8wrf1')
        n8.on('input', function (msg) {
          expect(msg.payload.entryStatus).toMatchObject({ 'good': 1, 'bad': 0, 'other': 0 })
          expect(msg.topic).toBe('TestTopicWrite')
          expect(msg.payload.nodetype).toBe('write')
          expect(msg.payload.injectType).toBe('write')
          done()
        })
      })
    })

    it('should have write results from payload without a valuesToWrite property', function (done) {
      const flow = Array.from(testFlows.testWriteWithoutValuesToWriteFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[7].port = port
      flow[8].endpoint = 'opc.tcp://localhost:' + port
      helper.load(writeNodesToLoad, flow, function () {
        let n6 = helper.getNode('n6wrf2')
        n6.on('input', function (msg) {
          expect(msg.payload.addressSpaceItems).toMatchObject([{
            'name': 'TestReadWrite',
            'nodeId': 'ns=1;s=TestReadWrite',
            'datatypeName': 'Double'
          }])
          expect(msg.payload.value.statusCodes).toBeDefined()
          expect(msg.payload.value.statusCodes?.length).toBeGreaterThan(0)
          expect(msg.payload.value.statusCodes[0]).toMatchObject(StatusCodes.Good)
          expect(msg.topic).toBe('TestTopicWrite')
          expect(msg.payload.nodetype).toBe('write')
          expect(msg.payload.injectType).toBe('write')
          done()
        })
      })
    })
  })
})
