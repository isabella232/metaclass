"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    AbstractMethod = require("../lib/AbstractMethod.class"),
    AbstractProperty = require("../lib/AbstractProperty.class"),
    Class = require("../lib/Class.class"),
    Comment = require("../lib/Comment.class"),
    Interface = require("../lib/Interface.class"),
    Method = require("../lib/Method.class"),
    Package = require("../lib/Package.class"),
    Param = require("../lib/Param.class"),
    Property = require("../lib/Property.class"),
    PropertyCollection = require("../lib/PropertyCollection.class"),
    Visibility = require("../lib/Visibility.class"),
    inherit = require("../lib/helpers/inherit"),
    is = require("../lib/helpers/is"),
    PropertyFilter = require("../lib/helpers/PropertyFilter.class"),
    index = require("..");

describe("index", function () {
    it("should export AbstractMethod", function () {
        expect(index.AbstractMethod).to.be(AbstractMethod);
    });
    it("should export AbstractProperty", function () {
        expect(index.AbstractProperty).to.be(AbstractProperty);
    });
    it("should export Class", function () {
        expect(index.Class).to.be(Class);
    });
    it("should export Comment", function () {
        expect(index.Comment).to.be(Comment);
    });
    it("should export Interface", function () {
        expect(index.Interface).to.be(Interface);
    });
    it("should export Method", function () {
        expect(index.Method).to.be(Method);
    });
    it("should export Package", function () {
        expect(index.Package).to.be(Package);
    });
    it("should export Param", function () {
        expect(index.Param).to.be(Param);
    });
    it("should export Property", function () {
        expect(index.Property).to.be(Property);
    });
    it("should export PropertyCollection", function () {
        expect(index.PropertyCollection).to.be(PropertyCollection);
    });
    it("should export Visibility", function () {
        expect(index.Visibility).to.be(Visibility);
    });
    it("should export helpers.inherit", function () {
        expect(index.helpers.inherit).to.be(inherit);
    });
    it("should export helpers.is", function () {
        expect(index.helpers.is).to.be(is);
    });
    it("should export helpers.PropertyFilter", function () {
        expect(index.helpers.PropertyFilter).to.be(PropertyFilter);
    });

});