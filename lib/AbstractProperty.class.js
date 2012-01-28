"use strict"; // run code in ES5 strict mode

var Visibility = require("./Visibility.class"),
    Comment = require("./Comment.class");

/**
 * Represents a class property without implementation code
 *
 * @class AbstractProperty
 */
module.exports = function AbstractProperty() {
    var Public = {constructor: this.constructor},
        self = this;

    /**
     * @private
     * @type {js.String}
     */
    this.__name = null;

    /**
     * @private
     * @type {lib.Class}
     */
    this.__type = undefined;

    /**
     * @private
     * @type {js.String}
     */
    this.__visibility = null;

    /**
     * @private
     * @type {lib.Comment}
     */
    this.__comment = null;

    /**
     * Returns true if the given value is one of the Visibility class' constants
     *
     * @private
     * @param {js.String} visibilityType
     * @return {js.Boolean}
     */
    this.__isAVisibilityType = function (visibilityType) {

        return visibilityType === Visibility.PUBLIC ||
            visibilityType === Visibility.PROTECTED ||
            visibilityType === Visibility.PRIVATE;

    }.bind(this);

    /**
     * @public
     * @param {js.String} name
     * @return {lib.AbstractProperty}
     */
    this.setName = Public.setName = function (name) {

        if (name !== null && typeof name !== "string") {
            throw new TypeError("The property's name must be a string");
        }
        this.__name = name;
        return Public;

    }.bind(this);

    /**
     * @public
     * @return {js.String}
     */
    this.getName = Public.getName = function () {

        return this.__name;

    }.bind(this);

    /**
     * Just pass the classId of the type, that the property shouild be.
     *
     * - For every Class within the package, it's e.g. lib.folder1.Class1.
     * - For every Class outside the package, it's e.g. moduleName.Class1
     * - For every native class it's e.g. js.Function
     * - For every node class it's e.g. node.EventEmitter
     *
     * If you pass an undefined value, the property can be of any type.
     *
     * @public
     * @param {js.String} type
     * @return {lib.AbstractProperty}
     */
    this.setType = Public.setType = function (type) {

        if (type !== undefined && type !== null && typeof type !== "string") {
            throw new TypeError("The property's type must be a string");
        }
        if (type === null) {
            type = undefined;
        }
        this.__type = type;
        return Public;

    }.bind(this);

    /**
     * @public
     * @return {js.String=undefined}
     */
    this.getType = Public.getType = function () {

        return this.__type;

    }.bind(this);

    /**
     * @public
     * @param {js.String} visibility a string from lib.Visibility
     * @return {lib.AbstractProperty}
     */
    this.setVisibility = Public.setVisibility = function (visibility) {

        if (visibility !== null && !this.__isAVisibilityType(visibility)) {
            throw new TypeError("The new visibility must be a value from the Visibility-class");
        }
        this.__visibility = visibility;
        return Public;

    }.bind(this);

    /**
     * @public
     * @return {js.String}
     */
    this.getVisibility = Public.getVisibility = function () {

        return this.__visibility;

    }.bind(this);

    /**
     * @public
     * @param {lib.Comment} comment
     * @return {lib.AbstractProperty}
     */
    this.setComment = Public.setComment = function (comment) {

        if (comment !== null && comment.instanceOf(Comment) === false) {
            throw new TypeError("The comment must be an instance of Comment");
        }
        this.__comment = comment;
        return Public;

    }.bind(this);

    /**
     * @public
     * @return {lib.Comment}
     */
    this.getComment = Public.getComment = function () {

        return this.__comment;

    }.bind(this);

    Public.instanceOf = function (Class) {return Public.constructor === Class || !self.Super || self.Super instanceof Class; }; return Public;
};