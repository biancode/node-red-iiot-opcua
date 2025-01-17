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

jest.setTimeout(45000)

// iiot opc ua nodes
var injectNode = require('../../src/opcua-iiot-inject')
var eventNode = require('../../src/opcua-iiot-event')
var responseNode = require('../../src/opcua-iiot-response')
var serverNode = require('../../src/opcua-iiot-server')
var connectorNode = require('../../src/opcua-iiot-connector')
var inputNode = require('../../src/opcua-iiot-listener')

var helper = require('node-red-node-test-helper')
var portHelper = require('./../helper/test-helper-extensions')
helper.init(require.resolve('node-red'))

var eventNodesToLoad = [injectNode, eventNode, connectorNode, inputNode, serverNode, responseNode]

var testFlows = require('./flows/event-listener-e2e-flows')

let testingOpcUaPort = 0

describe('OPC UA Listener event node e2e Testing', function () {

  beforeAll(() => {
    testingOpcUaPort = 53200
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

  describe('Listen event node', function () {
    let msgCounter = 0

    it('should get a message with nodetype events after base event node subscribe', function (done) {
      const flow = Array.from(testFlows.testListenerEventFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[8].port = port
      flow[9].endpoint = 'opc.tcp://localhost:' + port

      helper.load(eventNodesToLoad, flow, function () {
        msgCounter = 0
        let n4 = helper.getNode('n4ev')
        n4.on('input', function (msg) {
          msgCounter++
          if (msgCounter === 1) {
            expect(msg.topic).toBe('TestTopicEvent')
            expect(msg.payload.nodetype).toBe('events')
            expect(msg.payload.injectType).toBe('listen')
            done()
          }
        })
      })
    })

    it('should get a message with payload test after base event node subscribe', function (done) {
      const flow = Array.from(testFlows.testListenerEventFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[8].port = port
      flow[9].endpoint = 'opc.tcp://localhost:' + port

      helper.load(eventNodesToLoad, flow, function () {
        msgCounter = 0
        let n4 = helper.getNode('n4ev')
        n4.on('input', function (msg) {
          msgCounter++
          if (msgCounter === 1) {
            expect(msg.payload.eventType).toBe('BaseEventType')
            expect(msg.payload.uaEventFilter).toBeDefined()
            expect(msg.payload.uaEventFields).toBeDefined()
            setTimeout(done, 2000)
          }
        })
      })
    })

    it('should get a message with payload after inject unsubscribe', function (done) {
      const flow = Array.from(testFlows.testListenerEventFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[8].port = port
      flow[9].endpoint = 'opc.tcp://localhost:' + port

      helper.load(eventNodesToLoad, flow, function () {
        msgCounter = 0
        let n2 = helper.getNode('n2ev')
        n2.on('input', function (msg) {
          msgCounter++
          if (msgCounter === 2) {
            expect(msg.topic).toBe('TestTopicEventUnsubscribe')
            expect(msg.payload.nodetype).toBe('inject')
            expect(msg.payload.injectType).toBe('listen')
            setTimeout(done, 2000)
          }
        })
      })
    })

    it('should get a message with payload after base event unsubscribe', function (done) {
      const flow = Array.from(testFlows.testListenerEventFlow)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[8].port = port
      flow[9].endpoint = 'opc.tcp://localhost:' + port

      helper.load(eventNodesToLoad, flow, function () {
        msgCounter = 0
        let n2 = helper.getNode('n4ev')
        n2.on('input', function (msg) {
          msgCounter++
          if (msgCounter === 2) {
            expect(msg.topic).toBe('TestTopicEventUnsubscribe')
            expect(msg.payload.nodetype).toBe('events')
            expect(msg.payload.injectType).toBe('listen')
            setTimeout(done, 2000)
          }
        })
      })
    })

    it('should get a message with payload after base event subscribe', function (done) {
      const flow = Array.from(testFlows.listenToEventsOnServer)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[5].port = port
      flow[8].endpoint = 'opc.tcp://localhost:' + port

      helper.load(eventNodesToLoad, flow, function () {
        let n1 = helper.getNode('nh1ev')

        const test = 0

        n1.on('input', function (msg) {
          done()
        })
      })
    })

    it('should get a compressed response with payload after base event subscribe', function (done) {
      const flow = Array.from(testFlows.listenToEventsWithResponseOnServer)
      testingOpcUaPort = portHelper.getPort(testingOpcUaPort)
      const port = testingOpcUaPort
      flow[9].port = port
      flow[12].endpoint = 'opc.tcp://localhost:' + port

      helper.load(eventNodesToLoad, flow, function () {
        let n2 = helper.getNode('nh2evf2')
        n2.on('input', function (msg) {
          done()
        })
      })
    })
  })
})
