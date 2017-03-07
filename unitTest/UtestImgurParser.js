
"use strict";

module("UtestImgurParser");


QUnit.test("constructStandardHtmForImgur", function (assert) {
    let imagesList = [
        { hash: "pic1", ext: ".png" },
        { hash: "pic2", ext: ".jpg" }
    ];
    let div = ImgurParser.constructStandardHtmForImgur(imagesList);
    let images = util.getElements(div, "img");
    assert.equal(images.length, 2)
    assert.equal(images[0].outerHTML, "<img src=\"http://i.imgur.com/pic1.png\">");
    assert.equal(images[1].outerHTML, "<img src=\"http://i.imgur.com/pic2.jpg\">");
});

QUnit.test("replaceImgurLinksWithImages", function (assert) {
    let dom = TestUtils.makeDomWithBody(
        "<a href=\"http://dummy.com/K4CZyyP.jpg\">Insert image</a>" +
        "<a href=\"http://imgur.com/K4CZyyP.jpg\">Insert image</a>" +
        "<a href=\"http://i.imgur.com/K4CZyyP.jpg\">Insert image</a>" +
        "<a href=\"http://i.imgur.com/K4CZyyP.jpg\">"+
            "Insert image<img src=\"http://i.imgur.com/K4CZyyP.jpg\">"+
        "</a>"
    );

    ImgurParser.replaceImgurLinksWithImages(dom.body);
    assert.equal(dom.body.innerHTML, 
        "<a href=\"http://dummy.com/K4CZyyP.jpg\">Insert image</a>" +
        "<img src=\"http://imgur.com/K4CZyyP.jpg\">" +
        "<img src=\"http://i.imgur.com/K4CZyyP.jpg\">" +
        "<a href=\"http://i.imgur.com/K4CZyyP.jpg\">"+
            "Insert image<img src=\"http://i.imgur.com/K4CZyyP.jpg\">"+
        "</a>"
    );
});

QUnit.test("dontReplaceImgurGalleryLinksWithImages", function (assert) {
    let dom = TestUtils.makeDomWithBody("<a href=\"http://imgur.com/K4CZyyP\">Insert image</a>");
    ImgurParser.replaceImgurLinksWithImages(dom.body);
    assert.equal(dom.body.innerHTML, "<a href=\"http://imgur.com/K4CZyyP\">Insert image</a>");
});

QUnit.test("findImagesListPre20170303", function (assert) {
    let dom = TestUtils.makeDomWithBody(
        "<script>" +
        "window.runSlots = {_item: {\"album_images\":{\"count\":21,\"images\":[{\"hash\":\"zNuo7hV\",\"ext\":\".png\"},{\"hash\":\"bi7LaVD\",\"ext\":\".png\"}]}}}" +
        "</script>"
    );
    let images = ImgurParser.findImagesList(dom);
    assert.deepEqual(images, [{hash:"zNuo7hV", ext:".png"},{hash:"bi7LaVD", ext:".png"}]);
});

QUnit.test("isImgurHostName", function (assert) {
    assert.equal(true, ImgurParser.isImgurHostName("imgur.com"));
    assert.equal(true, ImgurParser.isImgurHostName("m.imgur.com"));
    assert.equal(false, ImgurParser.isImgurHostName("rimgur.com"));
});

QUnit.test("fixupImgurGalleryUrl", function (assert) {
    assert.equal("http://imgur.com/a/f7Ezg?grid", ImgurParser.fixupImgurGalleryUrl("http://imgur.com/a/f7Ezg"));
    assert.equal("http://imgur.com/a/f7Ezg?grid", ImgurParser.fixupImgurGalleryUrl("http://imgur.com/a/f7Ezg?grid"));
    assert.equal("http://imgur.com/a/DZYuHnc.png", ImgurParser.fixupImgurGalleryUrl("http://imgur.com/a/DZYuHnc.png"));
});