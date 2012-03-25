"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    is = require("../lib/helpers/is"),
    AbstractMethod = require("../lib/AbstractMethod.class.js"),
    AbstractProperty = require("../lib/AbstractProperty.class.js"),
    Method = require("../lib/Method.class.js"),
    Property = require("../lib/Property.class.js"),
    Interface = require("../lib/Interface.class.js"),
    combineStrings = require("./testHelpers/combineStrings.js"),
    createProperties = require("./testHelpers/createProperties.js"),
    sortByPropertyName = require("./testHelpers/sortByPropertyName.js"),
    checkError = require("./testHelpers/checkError.js");

describe("Interface", function () {
    var instance,
        possibleModes = [
            ["static", "instance"],
            ["abstract"],
            ["method"],
            ["public", "protected", "private"]
        ],
        allPossibleAbstractMethods = combineStrings(possibleModes);

    allPossibleAbstractMethods = createProperties(allPossibleAbstractMethods);
    allPossibleAbstractMethods.sort(sortByPropertyName);
    beforeEach(function () {
        instance = new Interface();
    });
    it("should return true", function () {
        expect(is(instance).instanceOf(Interface)).to.be(true);
    });
    describe("#setMethod", function () {
        it("should return the instance", function () {
            var instanceMethod = new AbstractMethod(),
                staticMethod = new AbstractMethod();

            instanceMethod
                .setName("someMethod")
                .setStatic(false);
            staticMethod
                .setName("someMethod")     // method with the same name. Should throw no error,
                .setStatic(true);
            expect(instance.setMethod(instanceMethod)).to.be(instance);
            expect(instance.setMethod(staticMethod)).to.be(instance);
        });
        it("should throw an exception", function () {
            expect(function () {
                instance.setMethod(undefined);
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.setMethod(null);
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.setMethod(true);
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.setMethod(1);
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.setMethod("some string");
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.setMethod({});
            }).to.throwException(checkError(TypeError));
            expect(function () {
                var property = new AbstractProperty();

                property.setName("myProperty");
                instance.setMethod(property); // no properties
            }).to.throwException(checkError(TypeError));
            expect(function () {
                var property = new Property();

                property.setName("myProperty");
                instance.setMethod(property); // no properties
            }).to.throwException(checkError(TypeError));
            expect(function () {
                var method = new Method();

                method.setName("myProperty");
                instance.setMethod(method); // no methods with implementation code
            }).to.throwException(checkError(TypeError));
            expect(function () {
                var method = new AbstractMethod();

                instance.setMethod(method); // method without a name
            }).to.throwException(checkError(Error));
        });
    });
    describe("#getMethod", function () {
        var instanceMethod,
            staticMethod;

        beforeEach(function () {
            instance = new Interface();
            instanceMethod = new AbstractMethod();
            instanceMethod.setStatic(false);
            staticMethod = new AbstractMethod();
            staticMethod.setStatic(true);
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
        var instanceMethod,
            staticMethod;

        beforeEach(function () {
            instance = new Interface();
            instanceMethod = new AbstractMethod();
            instanceMethod.setStatic(false);
            staticMethod = new AbstractMethod();
            staticMethod.setStatic(true);
        });

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
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.removeMethod(null);
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.removeMethod(true);
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.removeMethod(2);
            }).to.throwException(checkError(TypeError));
            expect(function () {
                instance.removeMethod({});
            }).to.throwException(checkError(TypeError));
        });
    });
    describe("#getMethods", function () {
        it("should return an empty array on a new interface", function () {
            expect(instance.getMethods()).to.eql([]);
        });
        it("should return all previously added methods", function () {
            var i,
                result,
                currentProperty;

            for (i = 0; i < allPossibleAbstractMethods.length; i++) {
                currentProperty = allPossibleAbstractMethods[i];
                instance.setMethod(currentProperty);
            }

            result = instance.getMethods();
            result.sort(sortByPropertyName);
            expect(result).to.eql(allPossibleAbstractMethods);
        });
    });
});
