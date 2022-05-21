const e = require('../utils/e');
const pool = require('../db/db');
const productqueries = require('../sqlqueries/productqueries');
const subcategories = require('../sqlqueries/subcategoriesQueries')
const utils = require('../utils/functions');
const Resize = require('../midlewares/Resize');
const url = require('url');
const videoSaver = require('../midlewares/VideoSaver')
const {then} = require("pg/lib/native/query");

async function roundproductcount(_id) {
    await pool.query(productqueries.ROUNDCOUNT, [_id, _id], (err1, result1) => {
        if (err1) {
            console.log(err1);
        }
    });
}

var getBigImages = async (req, res) => {
    var _id = req.params.id;
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgRuFlags.INVALID_PARAMS
        });
    }
    console.log(productqueries.GETPRODUCTIMAGES)
    await pool.query(productqueries.GETPRODUCTIMAGES, [_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message:  e.MsgTmFlags.INTERNAL_SERVER_ERROR
            })
        }
        var image_array = result.rows.map((elemet) => {
            return elemet.url;
        })

        return res.status(200).json({
            success: true,
            data: image_array
        });
    });
}
var getallProducts = async (req, res) => {
    var _id = req.params.id;
    let sub_id = req.params.sub_id || 0
    var url_parts = url.parse(req.url, true).query;
    var _page = url_parts.page;
    var _skip = (_page - 1) * 20;

    if (!_page) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        })
    }
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(productqueries.GETALLPRODUCTS(sub_id), [_id, _skip], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.ERROR
            });

        } else {
            return res.status(200).json({
                success: true,
                data: result.rows
            });
        }
    });
}
var getbyseearchtext = async (req, res) => {
    var _searchtext = req.body.searchtext || "";
    var url_parts = url.parse(req.url, true).query;
    var _pages = url_parts.page;
    var _skip = (_pages - 1) * 10;
    if (!_pages) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(productqueries.GETBYSEARHTEXT, [_searchtext, _skip], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows
        });
    });
}

var getFavorits = async (req, res) => {
    var _favorit_ids = req.body.ids || [0];

    if (!Array.isArray(_favorit_ids)) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    if (_favorit_ids.length === 0) {
        return res.status(200).json({
            success: true,
            data: []
        });
    }

    await pool.query(productqueries.GETFAVORITEPRODUCTS(_favorit_ids), (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows
        });
    })

}

var getProductByID = async (req, res) => {
    var _id = req.params.id;
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(productqueries.GETPRODUCTBYID, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        try {
            let data = result.rows[0];
            var image_result = await pool.query(productqueries.GETPRODUCTIMAGEFiles, [_id]);
            var image_array = [];
            let files = []
            image_result.rows.forEach((elemet) => {
                if (elemet.type === 'IMAGE') {
                    image_array.push(elemet.url);
                } else {
                    files.push(elemet)
                }
            })
            data['images'] = image_array;
            data['files'] = files;

            return res.status(200).json({
                success: true,
                data,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }

    });
}


var getSortedProducts = async (req, res) => {
    var _catid = req.params.cat_id;
    var _sortid = req.params.sort_id||0;
    let sub_id = req.params.sub_id || 0;
    var url_parts = url.parse(req.url, true).query;
    var _page = url_parts.page || 1;
    var _skip = (_page - 1) * 10;

    if (!(_catid !== undefined)) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        })
    }
    if (_sortid > 3 || _sortid < 0) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(productqueries.GETSORTPRODUCTS(req.body, _sortid, _catid, sub_id), [_skip], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.ERROR
            })
        } else {
            return res.status(200).json({
                success: true,
                data: result.rows
            });
        }
    });
}
var getFilterParametres = async (req, res) => {
    var _categoryid = req.params.cid;
    if (_categoryid == undefined) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(productqueries.GETPRODUCTIDS(_categoryid), async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if (result.rowCount === 0) {
            return res.status(200).json({
                "success": true,
                "maxprice": 0,
                "minprice": 0,
                "size": [],
                "colors": []
            });
        }
        var product_ids = [0];
        result.rows.forEach(element => {
            product_ids.push(element.id);
        });

        try {
            var minmaxresult = await pool.query(productqueries.GETMINANDMAXPRICE(_categoryid));
            var size = await pool.query(productqueries.GETSIZES(product_ids));
            var colors = await pool.query(productqueries.GETCOLORS(req.header('language'), product_ids));
            return res.status(200).json({
                success: true,
                maxprice: minmaxresult.rows[0].maxprice,
                minprice: minmaxresult.rows[0].minprice,
                size: size.rows,
                colors: colors.rows
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
    });
}


var createProduct = async (req, res) => {
    const imagePath = 'productimages';
    var verif = utils.verifieproductbody(req);
    if (!verif) {
        console.log(req.body);
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    if (!req.file) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.ERROR_UPLOAD_SAVE_IMAGE_FAIL
        });
    }
    var extention = "" + req.file.originalname;
    extention = extention.slice(extention.lastIndexOf('.'));
    const fileUpload = new Resize(imagePath, Date.now() + extention);
    const filename = await fileUpload.save(req.file.buffer);
    const image_url = fileUpload.fileURL();
    verif.push(image_url);
    return await pool.query(productqueries.INSERTPRODUCT, verif)
        .then((result) => {
            return result.rows[0]
        }).then(async data => {
            let catDatas = await pool.query(subcategories.GETSUBCATEGORYBYID, [data.sub_id])
            console.log(catDatas)
            data['cat_name'] = catDatas.rows[0].cat_name;
            data['subname'] = catDatas.rows[0].name;
            return res.status(200).json({
                success: true,
                data
            });
        }).catch(async err => {
            await utils.deleteServerFilePath(image_url, 0);
            console.log(err);
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        })

}
var updateproductdatas = async (req, res) => {
    const imagePath = 'productimages';
    var _id = req.body.id;
    var verif = utils.verifieproductbody(req);
    if (!verif || !_id) {
        console.log(req.body);
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(productqueries.GETFORCHECK, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if (result.rowCount === 0) {
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
            });
        }
        var imagetmb = result.rows[0].imagetmb;
        if (req.file) {
            var extention = "" + req.file.originalname;
            extention = extention.slice(extention.lastIndexOf('.'));
            const fileUpload = new Resize(imagePath, Date.now() + extention);
            const filename = await fileUpload.save(req.file.buffer);
            imagetmb = fileUpload.fileURL();
        }
        verif.push(imagetmb);
        verif.push(_id);
        await pool.query(productqueries.UPDATEPRODUCT, verif).then(async (insres) => {
            if (req.file) {
                await utils.deleteServerFilePath(result.rows[0].imagetmb, 0);
            }
            return insres.rows[0]
        }).then(async data => {
            let catDatas = await pool.query(subcategories.GETSUBCATEGORYBYID, [data.sub_id])
            data['cat_name'] = catDatas.rows[0].cat_name;
            data['subname'] = catDatas.rows[0].name;
            return res.status(200).json({
                success: true,
                data
            });
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        })
    });
}
var updateProductFile = async (req, res) => {
    const imagePath = 'productFiles';
    let {name, id} = req.body;
    await pool.query(productqueries.GETFORCHECKFILE, [id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INVALID_PARAMS,
            });
        }
        var videoUrl = result.rows[0].url;
        if (req.file) {
            let extention = "" + req.file.originalname;
            extention = extention.slice(extention.lastIndexOf('.'));
            const fileUpload = new videoSaver(imagePath,Date.now() + extention);
            await fileUpload.save(req.file.buffer);
            videoUrl = fileUpload.fileURL();
            const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
        }
        await pool.query(productqueries.UPDATEPRODUCTFILEBYID, [id,name,videoUrl]).then(async (insres) => {
            if (req.file) {
                await utils.deleteServerFilePath(result.rows[0].url, 0);
            }
            return insres.rows[0]
        }).then(async data => {
            return res.status(200).json({
                success: true,
                data
            });
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        })
    });
}

var addimagetoproduct = async (req, res) => {
    const _id = req.body.id;
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.ERROR_IMAGE_DOES_NOT_EXISTS
        });
    }
    const imagePath = 'productimagelist';
    await pool.query(productqueries.GETFORCHECK, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        if (!result.rowCount) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        var extention = "" + req.file.originalname;
        //console.log(typeof(extention));
        extention = extention.slice(extention.lastIndexOf('.'));
        const fileUpload = new Resize(imagePath, Date.now() + extention);
        fileUpload.setparams(500, 500);
        const filename = await fileUpload.save(req.file.buffer);

        const image_url = fileUpload.fileURL();
        const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
        await pool.query(productqueries.INSERTPRODUCTIMAGE, [image_url, _id], async (errq, resultdata) => {
            if (errq) {
                console.log(errq);
                await utils.deleteServerFilePath(image_url, 0);
                return res.status(500).json({
                    success: false,
                    message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                });
            }
            return res.status(200).json({
                success: true,
                data: resultdata.rows[0]
            });
        });
    });
}
var addFileToProduct = async (req, res) => {
    const _id = req.body.id;
    let name = req.body.name || '';
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.ERROR_IMAGE_DOES_NOT_EXISTS
        });
    }
    const imagePath = 'productFiles';
    await pool.query(productqueries.GETFORCHECK, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        if (!result.rowCount) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        let extention = "" + req.file.originalname;
        extention = extention.slice(extention.lastIndexOf('.'));
        const fileUpload = new videoSaver(imagePath,
            Date.now() + extention);
        await fileUpload.save(req.file.buffer);
        let videoUrl = fileUpload.fileURL();
        const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
        await pool.query(productqueries.INSERTPRODUCTFILE, [videoUrl, _id, name], async (errq, resultdata) => {
            if (errq) {
                console.log(errq);
                await utils.deleteServerFilePath(videoUrl, 0);
                return res.status(500).json({
                    success: false,
                    message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                });
            }
            return res.status(200).json({
                success: true,
                data: resultdata.rows[0]
            });
        });
    });
}
var deleteproductimage = async (req, res) => {
    const _id = req.params.id;
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(productqueries.GETPRODUCTIMAGEBYID, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if (!result.rowCount) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }

        await pool.query(productqueries.DELETEPRODUCTIMAGE, [_id], async (err, result2) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                });
            }
            await utils.deleteServerFilePath(result.rows[0].url, 0);
            return res.status(200).json({
                success: true,
            });
        });

    });

}


var deleteProduct = async (req, res) => {
    const _id = req.params.id;
    const imagePath = 'productimages';
    if (!_id) {
        // console.log(req.body);
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(productqueries.GETFORCHECK, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        if (!result.rowCount) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }

        await utils.deleteServerFilePath(result.rows[0].imagetmb, 0);

        await pool.query(productqueries.GETFILESFORDELETE, [_id], async (error, resultdata) => {
            if (error) {
                console.log(error);
                return res.status(400).json({
                    success: false,
                    message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                });
            }
            for (var i = 0; i < resultdata.rowCount; i++) {
                await utils.deleteServerFilePath(resultdata.rows[i].url, 0);
            }
            await pool.query(productqueries.DELETEALLPRODUCTIMAGE, [_id], async (err1, result1) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                    });
                }
                await pool.query(productqueries.DELETEPRODUCT, [_id], async (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            success: false,
                            message: e.MsgTmFlags.ERROR
                        });
                    }
                    return res.status(200).json({
                        success: true,
                    });

                });
            });
        });
    });

}
var getproductsadmin = async (req, res) => {
    var url_parts = url.parse(req.url, true).query;
    var _filtertext = url_parts.filtertext || "";
    var _category_id = url_parts.category_id || 0;
    let sub_id = url_parts.sub_id || 0;
    let queryForAll = productqueries.GETPRODUCTSFORADMIN;
    if (_category_id) {
        queryForAll += ` and p.cat_id=` + _category_id;

    }
    if (sub_id) {
        queryForAll += ` and p.sub_id=` + sub_id;
    }
    queryForAll += ' order by p.id; '
    return await pool.query(queryForAll, [_filtertext, _filtertext], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        } else {
            return res.status(200).json({
                success: true,
                data: result.rows
            });
        }
    });
}
// var getproductpages = async (req, res) => {
//     var url_parts = url.parse(req.url, true).query;
//     var _count = url_parts.count;
//     var _category_id = url_parts.category_id || 0;
//     var _filtertext = url_parts.filtertext || "";
//     if (!_count) {
//         console.log(url_parts);
//         return res.status(400).json({
//             success: false,
//             message: e.MsgTmFlags.INVALID_PARAMS
//         });
//     }
//     if (_category_id == 0) {
//
//     } else {
//         await pool.query(productqueries.GETPRODUCTCOUNTBYID, [_category_id, _filtertext, _filtertext], (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).json({
//                     success: false,
//                     message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
//                 });
//
//             } else {
//                 var count = result.rows[0].count / _count;
//                 var pagesss = [];
//                 if (Math.floor(count) < count) count += 1;
//                 for (var i = 1; i <= count; i++) pagesss.push(i);
//                 return res.status(200).json({
//                     success: true,
//                     data: pagesss
//                 });
//             }
//         });
//     }
// }
var getproducts = async (req, res) => {
    //console.log(req.url);
    var _id = req.params.id;
    if (!_id) {
        // console.log(req.body);
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS,
        });
    }
    //console.log(productqueries.GETPRODUCT);
    await pool.query(productqueries.GETPRODUCT, [_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
            });
        }
        if (result.rowCount == 0) {
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INVALID_PARAMS,
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    });
}
var getProductIMAGES = async (req, res) => {
    var url_parts = url.parse(req.url, true).query;
    let fileType=url_parts.file_type;
    var _id = req.params.id;
    if (!_id) {
        // console.log(req.body);
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS,
        });
    }
    await pool.query(productqueries.GETFILESFORDELETE, [_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows,
        });
    });
}
// var getProductdiscounts = async (req, res) => {
//     var _id = req.params.id;
//     if (!_id) {
//         // console.log(req.body);
//         return res.status(400).json({
//             success: false,
//             msg: e.MsgTmFlags.INVALID_PARAMS,
//         });
//     }
//     await pool.query(productqueries.GETPRODYCTDISCOUNTS, [_id], (err, result) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
//             });
//         }
//         return res.status(200).json({
//             success: true,
//             data: result.rows,
//         });
//     });
// }
var updateprodductcount = async (req, res) => {
    var _id = req.body.id;
    var count = req.body.count;
    console.log(req.body);
    if (!_id || !count) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS,
        });
    }
    await pool.query(productqueries.CHACKCOUNT, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if (result.rowCount == 0) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        var image_url = result.rows[0].image_url;
        if (req.file) {
            const imagePath = 'productcoloredimage';
            var extention = "" + req.file.originalname;
            //console.log(typeof(extention));
            extention = extention.slice(extention.lastIndexOf('.'));
            const fileUpload = new Resize(imagePath, Date.now() + extention);
            fileUpload.setparams(100, 100);
            const filename = await fileUpload.save(req.file.buffer);
            image_url = fileUpload.fileURL();
        }
        const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
        await pool.query(productqueries.UPDATEDISCOUNT, [_id, count, image_url], async (inserterr, insertresult) => {
            if (inserterr) {
                console.log(errq);
                if (req.file) await utils.deleteServerFilePath(image_url, 0);
                return res.status(500).json({
                    success: false,
                    message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                });
            }
            if (req.file) await utils.deleteServerFilePath(result.rows[0].image_url, 0);
            await roundproductcount(insertresult.rows[0].prod_id);
            return res.status(200).json({
                success: true,
                data: insertresult.rows[0]

            });
        });

    });
}
module.exports = {
    getallProducts,
    getProductByID,
    getSortedProducts,
    getFilterParametres,
    createProduct,
    addimagetoproduct,
    deleteproductimage,
    deleteProduct,
    getproductsadmin,
    getproducts,
    getProductIMAGES,
    updateprodductcount,
    updateproductdatas,
    getFavorits,
    getbyseearchtext,
    getBigImages,
    addFileToProduct,
    updateProductFile
}
