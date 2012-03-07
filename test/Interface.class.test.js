"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    Interface,
    modulePath = "../lib/Interface.class.js",
    sinon = require("sinon"),
    injectr = require("injectr");

function typeError(err) {
    expect(err.constructor).to.be(TypeError);
}

describe("Interface", function () {
    describe("#instanceOf", function () {
        var instance;

        it("should return true", function () {
            Interface = require(modulePath);
            instance = new Interface();
            expect(instance.instanceOf(Interface)).to.be(true);
        });
    });
    describe("#setMethod", function () {
        var PropertyCollectionStub,
            stub;

        before(function () {
            PropertyCollectionStub = function () {};
            stub = sinon.stub();
            PropertyCollectionStub.prototype.setProperty = stub;
        });
        it("should return the instance", function () {
            var method = {},
                instance;

            stub = sinon.stub();
            stub.returns(true);
            method.instanceOf = stub;
            Interface = injectr(modulePath, {
                "./PropertyCollection.class": PropertyCollectionStub,
                "./AbstractMethod"
            });
            instance = new Interface();
            expect(
                instance.setMethod(method)).to.be(instance
            );
            expect(
                method.instanceOf.calledOnce
            ).to.be(true);
            expect(
                PropertyCollectionStub.prototype.setProperty.calledWithExactly(method)
            ).to.be(true);
        });
        it("should throw an exception", function () {
            var Instance = require(modulePath),
                instance = new Instance();

            expect(function () {
                instance.setMethod(undefined);
            }).to.throwException(typeError);
            expect(function () {
                instance.setMethod(null);
            }).to.throwException(typeError);
            expect(function () {
                instance.setMethod(true);
            }).to.throwException(typeError);
            expect(function () {
                instance.setMethod(1);
            }).to.throwException(typeError);
            expect(function () {
                instance.setMethod("some string");
            }).to.throwException(typeError);
            expect(function () {
                instance.setMethod({});
            }).to.throwException(typeError);
            expect(function () {
                var property = {};

                stub = sinon.stub();
                stub.returns(false);
                property.instanceOf = stub;
                instance.setMethod(property); // property instead of method
            }).to.throwException(typeError);
        });
    });
    describe("#getMethod", function () {
        var instance,
            Instance = require(modulePath);

        beforeEach(function () {
            instance = new Instance();
        });
        it("should return null", function () {
            expect(instance.getMethod("someMethod")).to.be(null);
            expect(instance.getMethod("someMethod", true)).to.be(null);
            expect(instance.getMethod("someMethod", false)).to.be(null);
        });
        it("should return the method", function () {
            instanceMethod.setName("someMethod");
            instance.setMethod(instanceMethod);
            staticMethod.setName("someMethod");
            instance.setMethod(staticMethod);
            expect(instance.getMethod("someMethod")).to.be(instanceMethod);
            expect(instance.getMethod("someMethod", false)).to.be(instanceMethod);
            expect(instance.getMethod("someMethod", true)).to.be(staticMethod);
        });
    });
    describe("#removeMethod", function () {
        it("should return undefined", function () {
            expect(instance.removeMethod("someMethod")).to.be(undefined);
            instanceMethod.setName("someMethod");
            instance.setMethod(instanceMethod);
            expect(instance.removeMethod(instanceMethod)).to.be(undefined);
        });
        it("should actually remove the method", function () {
            instanceMethod.setName("someMethod");
            staticMethod.setName("someMethod");
            instance
                .setMethod(instanceMethod)
                .setMethod(staticMethod)
                .removeMethod("someMethod");
            expect(instance.getMethod("someMethod", true)).to.be(null);
            expect(instance.getMethod("someMethod", false)).to.be(null);
            instance
                .setMethod(instanceMethod)
                .setMethod(staticMethod)
                .removeMethod(instanceMethod);
            expect(instance.getMethod("someMethod", true)).to.be(staticMethod);
            expect(instance.getMethod("someMethod", false)).to.be(null);
        });
        it("should throw an exception", function () {
            expect(function () {
                instance.removeMethod(undefined);
            }).to.throwException();
            expect(function () {
                instance.removeMethod(null);
            }).to.throwException();
            expect(function () {
                instance.removeMethod(true);
            }).to.throwException();
            expect(function () {
                instance.removeMethod(2);
            }).to.throwException();
            expect(function () {
                instance.removeMethod({});
            }).to.throwException();
        });
    });
    describe("#getProperties", function () {
        var possibleModes = [
                ["static", "instance"],
                ["abstract", "implemented"],
                ["public", "protected", "private"]
            ],
            method,
            i,
            combinations = [],
            properties = [];

        // creates every possible combination of static/instance, abstract/implemented, attribute/method, public/protected/private
        function combine(currentModeCategory, result) {
            var i,
                tempResult,
                modes = possibleModes[currentModeCategory];

            for (i = 0; i < modes.length; i++) {
                result = result || "";
                tempResult = result + modes[i];
                if (currentModeCategory === possibleModes.length - 1) {
                    combinations.push(tempResult);
                } else {
                    combine(currentModeCategory + 1, tempResult + " ");
                }
            }
        }

        function createProperty(propName) {
            var method;

            if (propName.match("abstract")) {   // IF TRUE: It's abstract
                method = new AbstractMethod();
            } else { // IF TRUE: It's implemented
                method = new Method();
            }

            method.setName(propName);

            if (propName.match("static")) { // IF TRUE: It's static
                method.setStatic(true);
            } else { // IF TRUE: It's an instance property
                method.setStatic(false);
            }

            if (propName.match("public")) { // IF TRUE: It's public
                method.setVisibility(Visibility.PUBLIC);
            } else if (propName.match("protected")) { // IF TRUE: It's protected
                method.setVisibility(Visibility.PROTECTED);
            } else { // IF TRUE: It's private
                method.setVisibility(Visibility.PRIVATE);
            }

            return method;
        }

        function setUp() {
            var i,
                prop,
                propName;

            for (i = 0; i < combinations.length; i++) {
                propName = combinations[i];
                prop = createProperty(propName);
                properties[i] = prop;
                instance.setMethod(prop);
            }
        }

        combine(0);

        it("should return all properties", function () {
            var selection,
                propertyTypes = [],
                i;

            setUp();
            selection = instance.getMethods();
            for (i = 0; i < selection.length; i++) {
                propertyTypes.push(selection[i].getName());
            }
            for (i = 0; i < properties.length; i++) {
                expect(propertyTypes).to.contain(properties[i].getName());
            }
        });
        it("should return the desired selection of properties", function () {
            var i,
                selection,
                currentCombination;

            setUp();
            for (i = 0; i < combinations.length; i++) {
                currentCombination = combinations[i];
                selection = instance.getMethods({
                    Static: !!currentCombination.match("static"),
                    Instance: !!currentCombination.match("instance"),
                    Abstract: !!currentCombination.match("abstract"),
                    Implemented: !!currentCombination.match("implemented"),
                    Private: !!currentCombination.match("private"),
                    Protected: !!currentCombination.match("protected"),
                    Public: !!currentCombination.match("public")
                });
                expect(selection).to.eql([
                    properties[i]
                ]);
            }
        });
        it("should throw an exception", function () {
            expect(function () {
                instance.getMethods(null);
            }).to.throwException();
            expect(function () {
                instance.getMethods(2);
            }).to.throwException();
            expect(function () {
                instance.getMethods("someString");
            }).to.throwException();
            expect(function () {
                instance.getMethods([]);
            }).to.throwException();
        });
    });
});
