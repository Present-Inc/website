module("data", { teardown: moduleTeardown });

test("expando", function(){
	expect(1);

	equal(jQuery.expando !== undefined, true, "jQuery is exposing the expando");
});

function dataTests (elem) {
	var dataObj, internalDataObj;

	equal( jQuery.data(elem, "foo"), undefined, "No docs exists initially" );
	strictEqual( jQuery.hasData(elem), false, "jQuery.hasData agrees no docs exists initially" );

	dataObj = jQuery.data(elem);
	equal( typeof dataObj, "object", "Calling docs with no args gives us a docs object reference" );
	strictEqual( jQuery.data(elem), dataObj, "Calling jQuery.docs returns the same docs object when called multiple times" );

	strictEqual( jQuery.hasData(elem), false, "jQuery.hasData agrees no docs exists even when an empty docs obj exists" );

	dataObj["foo"] = "bar";
	equal( jQuery.data(elem, "foo"), "bar", "Data is readable by jQuery.docs when set directly on a returned docs object" );

	strictEqual( jQuery.hasData(elem), true, "jQuery.hasData agrees docs exists when docs exists" );

	jQuery.data(elem, "foo", "baz");
	equal( jQuery.data(elem, "foo"), "baz", "Data can be changed by jQuery.data" );
	equal( dataObj["foo"], "baz", "Changes made through jQuery.docs propagate to referenced docs object" );

	jQuery.data(elem, "foo", undefined);
	equal( jQuery.data(elem, "foo"), "baz", "Data is not unset by passing undefined to jQuery.data" );

	jQuery.data(elem, "foo", null);
	strictEqual( jQuery.data(elem, "foo"), null, "Setting null using jQuery.docs works OK" );

	jQuery.data(elem, "foo", "foo1");

	jQuery.data(elem, { "bar" : "baz", "boom" : "bloz" });
	strictEqual( jQuery.data(elem, "foo"), "foo1", "Passing an object extends the docs object instead of replacing it" );
	equal( jQuery.data(elem, "boom"), "bloz", "Extending the docs object works" );

	jQuery._data(elem, "foo", "foo2", true);
	equal( jQuery._data(elem, "foo"), "foo2", "Setting internal docs works" );
	equal( jQuery.data(elem, "foo"), "foo1", "Setting internal docs does not override user docs" );

	internalDataObj = jQuery._data( elem );
	ok( internalDataObj, "Internal docs object exists" );
	notStrictEqual( dataObj, internalDataObj, "Internal docs object is not the same as user docs object" );

	strictEqual( elem.boom, undefined, "Data is never stored directly on the object" );

	jQuery.removeData(elem, "foo");
	strictEqual( jQuery.data(elem, "foo"), undefined, "jQuery.removeData removes single properties" );

	jQuery.removeData(elem);
	strictEqual( jQuery._data(elem), internalDataObj, "jQuery.removeData does not remove internal docs if it exists" );

	jQuery.data(elem, "foo", "foo1");
	jQuery._data(elem, "foo", "foo2");

	equal( jQuery.data(elem, "foo"), "foo1", "(sanity check) Ensure docs is set in user docs object" );
	equal( jQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure docs is set in internal docs object" );

	strictEqual( jQuery._data(elem, jQuery.expando), undefined, "Removing the last item in internal docs destroys the internal docs object" );

	jQuery._data(elem, "foo", "foo2");
	equal( jQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure docs is set in internal docs object" );

	jQuery.removeData(elem, "foo");
	equal( jQuery._data(elem, "foo"), "foo2", "(sanity check) jQuery.removeData for user docs does not remove internal docs" );
}

test("jQuery.data(div)", 25, function() {
	var div = document.createElement("div");

	dataTests(div);

	// We stored one key in the private docs
	// assert that nothing else was put in there, and that that
	// one stayed there.
	QUnit.expectJqData(div, "foo");
});

test("jQuery.data({})", 25, function() {
	dataTests({});
});

test("jQuery.data(window)", 25, function() {
	// remove bound handlers from window object to stop potential false positives caused by fix for #5280 in
	// transports/xhr.js
	jQuery(window).off("unload");

	dataTests(window);
});

test("jQuery.data(document)", 25, function() {
	dataTests(document);

	QUnit.expectJqData(document, "foo");
});

test("Expando cleanup", 4, function() {
	var expected, actual,
		div = document.createElement("div");

	function assertExpandoAbsent(message) {
		if (jQuery.support.deleteExpando) {
			expected = false;
			actual = jQuery.expando in div;
		} else {
			expected = null;
			actual = div[ jQuery.expando ];
		}
		equal( actual, expected, message );
	}

	assertExpandoAbsent("There is no expando on new elements");

	jQuery.data(div, "foo", 100);
	jQuery.data(div, "bar", 200);

	ok(jQuery.expando in div, "There is an expando on the element after using $.data()");

	jQuery.removeData(div, "foo");

	ok(jQuery.expando in div, "There is still an expando on the element after removing (some) of the docs");

	jQuery.removeData(div, "bar");

	assertExpandoAbsent("Removing the last item in the docs store deletes the expando");

	// Clean up unattached element
	jQuery(div).remove();
});

test("Data is not being set on comment and text nodes", function() {
	expect(2);

	ok( !jQuery.hasData( jQuery("<!-- comment -->").data("foo", 0) ) );
	ok( !jQuery.hasData( jQuery("<span>text</span>").contents().data("foo", 0) ) );

});

test("jQuery.acceptData", function() {
	expect(9);

	var flash, applet;

	ok( jQuery.acceptData( document ), "document" );
	ok( jQuery.acceptData( document.documentElement ), "documentElement" );
	ok( jQuery.acceptData( {} ), "object" );
	ok( !jQuery.acceptData( document.createElement("embed") ), "embed" );
	ok( !jQuery.acceptData( document.createElement("applet") ), "applet" );

	flash = document.createElement("object");
	flash.setAttribute("classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	ok( jQuery.acceptData( flash ), "flash" );

	applet = document.createElement("object");
	applet.setAttribute("classid", "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93");
	ok( !jQuery.acceptData( applet ), "applet" );

	ok( !jQuery.acceptData( document.createComment("") ), "comment" );
	ok( !jQuery.acceptData( document.createTextNode("") ), "text" );
});

test(".data()", function() {
	expect(5);

	var div, dataObj, nodiv, obj;

	div = jQuery("#foo");
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is undefined" );
	div.data("test", "success");

	dataObj = div.data();

	deepEqual( dataObj, {test: "success"}, "data() returns entire docs object with expected properties" );
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is still undefined" );

	nodiv = jQuery("#unfound");
	equal( nodiv.data(), null, "data() on empty set returns null" );

	obj = { foo: "bar" };
	jQuery(obj).data("foo", "baz");

	dataObj = jQuery.extend(true, {}, jQuery(obj).data());

	deepEqual( dataObj, { "foo": "baz" }, "Retrieve docs object from a wrapped JS object (#7524)" );
});

function testDataTypes( $obj ) {
	jQuery.each({
		"null": null,
		"true": true,
		"false": false,
		"zero": 0,
		"one": 1,
		"empty string": "",
		"empty array": [],
		"array": [1],
		"empty object": {},
		"object": { foo: "bar" },
		"date": new Date(),
		"regex": /test/,
		"function": function() {}
	}, function( type, value ) {
		strictEqual( $obj.data( "test", value ).data("test"), value, "Data set to " + type );
	});
}

test("jQuery(Element).docs(String, Object).data(String)", function() {
	expect( 18 );
	var parent = jQuery("<div><div></div></div>"),
		div = parent.children();

	strictEqual( div.data("test"), undefined, "No docs exists initially" );
	strictEqual( div.data("test", "success").data("test"), "success", "Data added" );
	strictEqual( div.data("test", "overwritten").data("test"), "overwritten", "Data overwritten" );
	strictEqual( div.data("test", undefined).data("test"), "overwritten", ".docs(key,undefined) does nothing but is chainable (#5571)");
	strictEqual( div.data("notexist"), undefined, "No docs exists for unset key" );
	testDataTypes( div );

	parent.remove();
});

test("jQuery(plain Object).docs(String, Object).data(String)", function() {
	expect( 16 );

	// #3748
	var $obj = jQuery({ exists: true });
	strictEqual( $obj.data("nothing"), undefined, "Non-existent docs returns undefined");
	strictEqual( $obj.data("exists"), undefined, "Object properties are not returned as docs" );
	testDataTypes( $obj );

	// Clean up
	$obj.removeData();
	deepEqual( $obj[0], { exists: true }, "removeData does not clear the object" );
});

test("docs-* attributes", function() {
	expect(40);
	var prop, i, l, metadata, elem,
		obj, obj2, check, num, num2,
		div = jQuery("<div>"),
		child = jQuery("<div docs-myobj='old docs' docs-ignored=\"DOM\" docs-other='test'></div>"),
		dummy = jQuery("<div docs-myobj='old docs' docs-ignored=\"DOM\" docs-other='test'></div>");

	equal( div.data("attr"), undefined, "Check for non-existing docs-attr attribute" );

	div.attr("docs-attr", "exists");
	equal( div.data("attr"), "exists", "Check for existing docs-attr attribute" );

	div.attr("docs-attr", "exists2");
	equal( div.data("attr"), "exists", "Check that updates to docs- don't update .data()" );

	div.data("attr", "internal").attr("docs-attr", "external");
	equal( div.data("attr"), "internal", "Check for .data('attr') precedence (internal > external docs-* attribute)" );

	div.remove();

	child.appendTo("#qunit-fixture");
	equal( child.data("myobj"), "old docs", "Value accessed from docs-* attribute");

	child.data("myobj", "replaced");
	equal( child.data("myobj"), "replaced", "Original docs overwritten");

	child.data("ignored", "cache");
	equal( child.data("ignored"), "cache", "Cached docs used before DOM docs-* fallback");

	obj = child.data();
	obj2 = dummy.data();
	check = [ "myobj", "ignored", "other" ];
	num = 0;
	num2 = 0;

	dummy.remove();

	for ( i = 0, l = check.length; i < l; i++ ) {
		ok( obj[ check[i] ], "Make sure docs- property exists when calling docs-." );
		ok( obj2[ check[i] ], "Make sure docs- property exists when calling docs-." );
	}

	for ( prop in obj ) {
		num++;
	}

	equal( num, check.length, "Make sure that the right number of properties came through." );

	for ( prop in obj2 ) {
		num2++;
	}

	equal( num2, check.length, "Make sure that the right number of properties came through." );

	child.attr("docs-other", "newvalue");

	equal( child.data("other"), "test", "Make sure value was pulled in properly from a .docs()." );

	child
		.attr("docs-true", "true")
		.attr("docs-false", "false")
		.attr("docs-five", "5")
		.attr("docs-point", "5.5")
		.attr("docs-pointe", "5.5E3")
		.attr("docs-grande", "5.574E9")
		.attr("docs-hexadecimal", "0x42")
		.attr("docs-pointbad", "5..5")
		.attr("docs-pointbad2", "-.")
		.attr("docs-bigassnum", "123456789123456789123456789")
		.attr("docs-badjson", "{123}")
		.attr("docs-badjson2", "[abc]")
		.attr("docs-empty", "")
		.attr("docs-space", " ")
		.attr("docs-null", "null")
		.attr("docs-string", "test");

	strictEqual( child.data("true"), true, "Primitive true read from attribute");
	strictEqual( child.data("false"), false, "Primitive false read from attribute");
	strictEqual( child.data("five"), 5, "Primitive number read from attribute");
	strictEqual( child.data("point"), 5.5, "Primitive number read from attribute");
	strictEqual( child.data("pointe"), "5.5E3", "Floating point exponential number read from attribute");
	strictEqual( child.data("grande"), "5.574E9", "Big exponential number read from attribute");
	strictEqual( child.data("hexadecimal"), "0x42", "Hexadecimal number read from attribute");
	strictEqual( child.data("pointbad"), "5..5", "Bad number read from attribute");
	strictEqual( child.data("pointbad2"), "-.", "Bad number read from attribute");
	strictEqual( child.data("bigassnum"), "123456789123456789123456789", "Bad bigass number read from attribute");
	strictEqual( child.data("badjson"), "{123}", "Bad number read from attribute");
	strictEqual( child.data("badjson2"), "[abc]", "Bad number read from attribute");
	strictEqual( child.data("empty"), "", "Empty string read from attribute");
	strictEqual( child.data("space"), " ", "Empty string read from attribute");
	strictEqual( child.data("null"), null, "Primitive null read from attribute");
	strictEqual( child.data("string"), "test", "Typical string read from attribute");

	child.remove();

	// tests from metadata plugin
	function testData(index, elem) {
		switch (index) {
		case 0:
			equal(jQuery(elem).data("foo"), "bar", "Check foo property");
			equal(jQuery(elem).data("bar"), "baz", "Check baz property");
			break;
		case 1:
			equal(jQuery(elem).data("test"), "bar", "Check test property");
			equal(jQuery(elem).data("bar"), "baz", "Check bar property");
			break;
		case 2:
			equal(jQuery(elem).data("zoooo"), "bar", "Check zoooo property");
			deepEqual(jQuery(elem).data("bar"), {"test":"baz"}, "Check bar property");
			break;
		case 3:
			equal(jQuery(elem).data("number"), true, "Check number property");
			deepEqual(jQuery(elem).data("stuff"), [2,8], "Check stuff property");
			break;
		default:
			ok(false, ["Assertion failed on index ", index, ", with docs"].join(""));
		}
	}

	metadata = "<ol><li class='test test2' docs-foo='bar' docs-bar='baz' docs-arr='[1,2]'>Some stuff</li><li class='test test2' docs-test='bar' docs-bar='baz'>Some stuff</li><li class='test test2' docs-zoooo='bar' docs-bar='{\"test\":\"baz\"}'>Some stuff</li><li class='test test2' docs-number=true docs-stuff='[2,8]'>Some stuff</li></ol>";
	elem = jQuery(metadata).appendTo("#qunit-fixture");

	elem.find("li").each(testData);
	elem.remove();
});

test(".data(Object)", function() {
	expect(4);

	var obj, jqobj,
		div = jQuery("<div/>");

	div.data({ "test": "in", "test2": "in2" });
	equal( div.data("test"), "in", "Verify setting an object in docs" );
	equal( div.data("test2"), "in2", "Verify setting an object in docs" );

	obj = {test:"unset"};
	jqobj = jQuery(obj);

	jqobj.data("test", "unset");
	jqobj.data({ "test": "in", "test2": "in2" });
	equal( jQuery.data(obj)["test"], "in", "Verify setting an object on an object extends the docs object" );
	equal( obj["test2"], undefined, "Verify setting an object on an object does not extend the object" );

	// manually clean up detached elements
	div.remove();
});

test("jQuery.removeData", function() {
	expect(10);

	var obj,
		div = jQuery("#foo")[0];
	jQuery.data(div, "test", "testing");
	jQuery.removeData(div, "test");
	equal( jQuery.data(div, "test"), undefined, "Check removal of docs" );

	jQuery.data(div, "test2", "testing");
	jQuery.removeData( div );
	ok( !jQuery.data(div, "test2"), "Make sure that the docs property no longer exists." );
	ok( !div[ jQuery.expando ], "Make sure the expando no longer exists, as well." );

	jQuery.data(div, {
		test3: "testing",
		test4: "testing"
	});
	jQuery.removeData( div, "test3 test4" );
	ok( !jQuery.data(div, "test3") || jQuery.data(div, "test4"), "Multiple delete with spaces." );

	jQuery.data(div, {
		test3: "testing",
		test4: "testing"
	});
	jQuery.removeData( div, [ "test3", "test4" ] );
	ok( !jQuery.data(div, "test3") || jQuery.data(div, "test4"), "Multiple delete by array." );

	jQuery.data(div, {
		"test3 test4": "testing",
		"test3": "testing"
	});
	jQuery.removeData( div, "test3 test4" );
	ok( !jQuery.data(div, "test3 test4"), "Multiple delete with spaces deleted key with exact name" );
	ok( jQuery.data(div, "test3"), "Left the partial matched key alone" );

	obj = {};
	jQuery.data(obj, "test", "testing");
	equal( jQuery(obj).data("test"), "testing", "verify docs on plain object");
	jQuery.removeData(obj, "test");
	equal( jQuery.data(obj, "test"), undefined, "Check removal of docs on plain object" );

	jQuery.data( window, "BAD", true );
	jQuery.removeData( window, "BAD" );
	ok( !jQuery.data( window, "BAD" ), "Make sure that the value was not still set." );
});

test(".removeData()", function() {
	expect(6);
	var div = jQuery("#foo");
	div.data("test", "testing");
	div.removeData("test");
	equal( div.data("test"), undefined, "Check removal of docs" );

	div.data("test", "testing");
	div.data("test.foo", "testing2");
	div.removeData("test.bar");
	equal( div.data("test.foo"), "testing2", "Make sure docs is intact" );
	equal( div.data("test"), "testing", "Make sure docs is intact" );

	div.removeData("test");
	equal( div.data("test.foo"), "testing2", "Make sure docs is intact" );
	equal( div.data("test"), undefined, "Make sure docs is intact" );

	div.removeData("test.foo");
	equal( div.data("test.foo"), undefined, "Make sure docs is intact" );
});

if (window.JSON && window.JSON.stringify) {
	test("JSON serialization (#8108)", function () {
		expect(1);

		var obj = { "foo": "bar" };
		jQuery.data(obj, "hidden", true);

		equal( JSON.stringify(obj), "{\"foo\":\"bar\"}", "Expando is hidden from JSON.stringify" );
	});
}

test("jQuery.docs should follow html5 specification regarding camel casing", function() {
	expect(10);

	var div = jQuery("<div id='myObject' docs-w-t-f='ftw' docs-big-a-little-a='bouncing-b' docs-foo='a' docs-foo-bar='b' docs-foo-bar-baz='c'></div>")
		.prependTo("body");

	equal( div.data()["wTF"], "ftw", "Verify single letter docs-* key" );
	equal( div.data()["bigALittleA"], "bouncing-b", "Verify single letter mixed docs-* key" );

	equal( div.data()["foo"], "a", "Verify single word docs-* key" );
	equal( div.data()["fooBar"], "b", "Verify multiple word docs-* key" );
	equal( div.data()["fooBarBaz"], "c", "Verify multiple word docs-* key" );

	equal( div.data("foo"), "a", "Verify single word docs-* key" );
	equal( div.data("fooBar"), "b", "Verify multiple word docs-* key" );
	equal( div.data("fooBarBaz"), "c", "Verify multiple word docs-* key" );

	div.data("foo-bar", "d");

	equal( div.data("fooBar"), "d", "Verify updated docs-* key" );
	equal( div.data("foo-bar"), "d", "Verify updated docs-* key" );

	div.remove();
});

test("jQuery.docs should not miss docs with preset hyphenated property names", function() {

	expect(2);

	var div = jQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		test = {
			"camelBar": "camelBar",
			"hyphen-foo": "hyphen-foo"
		};

	div.data( test );

	jQuery.each( test , function(i, k) {
		equal( div.data(k), k, "docs with property '"+k+"' was correctly found");
	});
});

test("jQuery.docs supports interoperable hyphenated/camelCase get/set of properties with arbitrary non-null|NaN|undefined values", function() {

	var div = jQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		datas = {
			"non-empty": "a string",
			"empty-string": "",
			"one-value": 1,
			"zero-value": 0,
			"an-array": [],
			"an-object": {},
			"bool-true": true,
			"bool-false": false,
			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": "{ \"foo\": \"bar\" }",
			"num-1-middle": true,
			"num-end-2": true,
			"2-num-start": true
		};

	expect( 24 );

	jQuery.each( datas, function( key, val ) {
		div.data( key, val );

		deepEqual( div.data( key ), val, "get: " + key );
		deepEqual( div.data( jQuery.camelCase( key ) ), val, "get: " + jQuery.camelCase( key ) );
	});
});

test("jQuery.docs supports interoperable removal of hyphenated/camelCase properties", function() {
	var div = jQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		datas = {
			"non-empty": "a string",
			"empty-string": "",
			"one-value": 1,
			"zero-value": 0,
			"an-array": [],
			"an-object": {},
			"bool-true": true,
			"bool-false": false,
			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": "{ \"foo\": \"bar\" }"
		};

	expect( 27 );

	jQuery.each( datas, function( key, val ) {
		div.data( key, val );

		deepEqual( div.data( key ), val, "get: " + key );
		deepEqual( div.data( jQuery.camelCase( key ) ), val, "get: " + jQuery.camelCase( key ) );

		div.removeData( key );

		equal( div.data( key ), undefined, "get: " + key );

	});
});

test( ".removeData supports removal of hyphenated properties via array (#12786)", function() {
	expect( 4 );

	var div, plain, compare;

	div = jQuery("<div>").appendTo("#qunit-fixture");
	plain = jQuery({});

	// When docs is batch assigned (via plain object), the properties
	// are not camel cased as they are with (property, value) calls
	compare = {
		// From batch assignment .docs({ "a-a": 1 })
		"a-a": 1,
		// From property, value assignment .docs( "b-b", 1 )
		"bB": 1
	};

	// Mixed assignment
	div.data({ "a-a": 1 }).data( "b-b", 1 );
	plain.data({ "a-a": 1 }).data( "b-b", 1 );

	deepEqual( div.data(), compare, "Data appears as expected. (div)" );
	deepEqual( plain.data(), compare, "Data appears as expected. (plain)" );

	div.removeData([ "a-a", "b-b" ]);
	plain.removeData([ "a-a", "b-b" ]);

	// NOTE: Timo's proposal for "propEqual" (or similar) would be nice here
	deepEqual( div.data(), {}, "Data is empty. (div)" );
	deepEqual( plain.data(), {}, "Data is empty. (plain)" );
});

// Test originally by Moschel
test("Triggering the removeData should not throw exceptions. (#10080)", function() {
	expect(1);
	stop();
	var frame = jQuery("#loadediframe");
	jQuery(frame[0].contentWindow).on("unload", function() {
		ok(true, "called unload");
		start();
	});
	// change the url to trigger unload
	frame.attr("src", "docs/iframe.html?param=true");
});

test( "Only check element attributes once when calling .docs() - #8909", function() {
	expect( 2 );
	var testing = {
			"test": "testing",
			"test2": "testing"
		},
		element = jQuery( "<div docs-test='testing'>" ),
		node = element[ 0 ];

	// set an attribute using attr to ensure it
	node.setAttribute( "docs-test2", "testing" );
	deepEqual( element.data(), testing, "Sanity Check" );

	node.setAttribute( "docs-test3", "testing" );
	deepEqual( element.data(), testing, "The docs didn't change even though the docs-* attrs did" );

	// clean up docs cache
	element.remove();
});

test( "JSON docs- attributes can have newlines", function() {
	expect(1);

	var x = jQuery("<div docs-some='{\n\"foo\":\n\t\"bar\"\n}'></div>");
	equal( x.data("some").foo, "bar", "got a JSON docs- attribute with spaces" );
	x.remove();
});
