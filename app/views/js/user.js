define(function(require, exports, module) {
    var $ = require("jquery");
    var bootstrap = require("bootstrap");
    var vue = require("vue");
    var layer = require("layer");
    var webuploader = require("webuploader");
    layer.config({
        path: '/app/views/js/vendor/layer/',
        extend: 'extend/layer.ext.js'
    });

    var DATA = {
        uploadToken: ''
    }
    exports.init = function(config) {
        var uid = config.uid;
        var topics = config.topics;
        var replys = config.replys;
        var fans = config.fans;
        var collections = config.collections;
        var page = 1;
        tpl = new Vue({
            el: '#profile-info',
            data: {
                topics: topics,
                replys: replys,
                collections: collections,
                fans: fans
            }
        });
        $(document).ready(function() {
            $("#profile-info").show();
        });

        $(".load-more-topic").on('click', function(event) {
            page ++;
            var that = this;
            var o = $(that).html();
            $(that).attr('disabled', 'disabled');
            $(that).html('<i class="fa fa-spinner fa-spin"></i> 加载中...');
            $.get('/user/topic/'+uid+'/'+page, function(data) {
                $(that).html(o);
                if (data.status == 'success') {
                    tpl.topics = tpl.topics.concat(data.data);
                    if (data.data.length != 0) {
                        $(that).removeAttr('disabled');
                    } else {
                        $(that).html('已加载全部');
                    }
                } else {
                    layer.msg(data.data, {icon: 2});
                    $(that).removeAttr('disabled');
                }
            }, 'json');
        });
        $(".load-more-collection").on('click', function(event) {
            page ++;
            var that = this;
            var o = $(that).html();
            $(that).attr('disabled', 'disabled');
            $(that).html('<i class="fa fa-spinner fa-spin"></i> 加载中...');
            $.get('/user/collection/'+uid+'/'+page, function(data) {
                $(that).html(o);
                if (data.status == 'success') {
                    tpl.collections = tpl.collections.concat(data.data);
                    if (data.data.length != 0) {
                        $(that).removeAttr('disabled');
                    } else {
                        $(that).html('已加载全部');
                    }
                } else {
                    layer.msg(data.data, {icon: 2});
                    $(that).removeAttr('disabled');
                }
            }, 'json');
        });
        $(".load-more-reply").on('click', function(event) {
            page ++;
            var that = this;
            var o = $(that).html();
            $(that).attr('disabled', 'disabled');
            $(that).html('<i class="fa fa-spinner fa-spin"></i> 加载中...');
            $.get('/user/reply/'+uid+'/'+page, function(data) {
                $(that).html(o);
                if (data.status == 'success') {
                    tpl.replys = tpl.replys.concat(data.data);
                    if (data.data.length != 0) {
                        $(that).removeAttr('disabled');
                    } else {
                        $(that).html('已加载全部');
                    }
                } else {
                    layer.msg(data.data, {icon: 2});
                    $(that).removeAttr('disabled');
                }
            }, 'json');
        });
        $(".load-more-fans").on('click', function(event) {
            page ++;
            var that = this;
            var o = $(that).html();
            $(that).attr('disabled', 'disabled');
            $(that).html('<i class="fa fa-spinner fa-spin"></i> 加载中...');
            $.get('/user/fans/'+uid+'/'+page, function(data) {
                $(that).html(o);
                if (data.status == 'success') {
                    tpl.fans = tpl.fans.concat(data.data);
                    if (data.data.length != 0) {
                        $(that).removeAttr('disabled');
                    } else {
                        $(that).html('已加载全部');
                    }
                } else {
                    layer.msg(data.data, {icon: 2});
                    $(that).removeAttr('disabled');
                }
            }, 'json');
        });
        $(".do-follow").on('click', function(event) {
            var that = this;
            $(that).attr('disabled', 'disabled');
            $(that).html('<i class="fa fa-spinner fa-spin"></i> 请求中...');
            $.post('/do/follow/', {
                fuid: $(that).data('fuid')
            }, function(data) {
                if (data.status == 'success') {
                    if (data.data == '1') {
                        $(that).html('<i class="fa fa-heart"></i> 取消关注TA');
                    } else {
                        $(that).html('<i class="fa fa-heart"></i> 关注TA');
                    }
                } else {
                    $(that).html('<i class="fa fa-heart"></i> 关注TA');
                    layer.msg(data.data, {icon: 2});
                }
                $(that).removeAttr('disabled');
            }, 'json');
        });
        $(".do-whisper").on('click', function(event) {
            var that = this;
            layer.open({
                type: 1,
                area : ['300px' , 'auto'],
                title: false,
                closeBtn: true,
                shadeClose: false,
                content: '<div class="form-group" style="padding: 15px; text-align: center;">'+
                            '<div class="col-sm-12">'+
                                '<textarea id="whisper-msg" class="form-control" placeholder="请输入私信内容，不超过200字" rows="5"></textarea>'+
                                '<a class="deliver-whisper btn btn-danger btn-sm btn-block" data-at_uid="'+$(that).data('at_uid')+'" style="margin: 5px 0;"><i class="fa fa-envelope"></i> 发送私信</a>'+
                                '<small class="help-block m-b-none">若对方设置了手机号，将同时收到短信提醒</small>'+
                                '<small class="help-block m-b-none">本次私信将消耗 <b>'+$(that).data('whisper')+'</b> 积分</small>'+
                            '</div>'+
                        '</div>'
            });

            $(".deliver-whisper").on('click', function(event) {
                var content = removeHTMLTag($("#whisper-msg").val());
                if (content.length < 2) {
                    layer.msg('私信内容应不少于两个字符', {icon: 2});
                    return;
                } else {
                    var that = this;
                    $(that).attr('disabled', 'disabled');
                    $(that).html('<i class="fa fa-spinner fa-spin"></i> 发送中...');
                    $.post('/deliver/whisper/', {
                        content: content,
                        at_uid: $(that).data('at_uid')
                    }, function(data) {
                        if (data.status == 'success') {
                            layer.msg(data.data, {icon: 1});
                            setTimeout(function() {
                                layer.closeAll();
                            }, 1500);
                        } else {
                            layer.msg(data.data, {icon: 2});
                        }
                        $(that).removeAttr('disabled');
                    }, 'json');
                }
            });
        });
        $(".doRecharge").on('click', function(event) {
            layer.prompt({
                title: '请输入充值金额（1元 = 100积分）',
                formType: 0
            }, function(money){
                money = $.trim(money);
                if (money > 0 && money <= 1000) {
                    $.get('/recharge/'+money, function(data) {
                        if (data.code == 10000) {
                            layer.msg('支付请求中', {icon: 16});
                            setTimeout(function() {
                                $('body').append(data.data);
                            }, 800);
                        } else {
                            layer.msg(data.data, {icon: 2});
                        }
                    }, 'json');
                } else {
                    layer.msg('单次充值人民币范围 1~1000', {icon: 2});
                }
            });
            $(".recharge-input").keyup(function(){
                var c=$(this);
                if(/[^\d]/.test(c.val())) {
                  var temp_amount=c.val().replace(/[^\d]/g,'');
                  $(this).val(temp_amount);
                }
            });
        });
        $(".doUpgrade").on('click', function(event) {
            var v2p = $(this).data('v2');
            var v3p = $(this).data('v3');
            layer.confirm('请点击选择所需升级的VIP。<br />V2所需积分：'+v2p+'<br />V3所需积分：'+v3p, {
                title: '升级提示',
                icon: 7,
                btn: ['VIP2', 'VIP3', '取消'],
                btn1: function(index, layero) {
                    $.post('/upgrade/vip/2', {

                    }, function(data, textStatus, xhr) {
                        if (data.status == 'success') {
                            layer.msg(data.data, {icon: 1});
                            setTimeout(function() {
                                window.location.href = "/login";
                            }, 1500);
                        } else {
                            layer.msg(data.data, {icon: 2});
                        }
                    }, 'json');
                },
                btn2: function(index, layero) {
                    $.post('/upgrade/vip/3', {

                    }, function(data, textStatus, xhr) {
                        if (data.status == 'success') {
                            setTimeout(function() {
                                window.location.href = "/login";
                            }, 1500);
                            layer.msg(data.data, {icon: 1});
                        } else {
                            layer.msg(data.data, {icon: 2});
                        }
                    }, 'json');
                },
                btn3: function(index, layero) {
                    layer.close(index);
                }
            });
        });
        function removeHTMLTag(str) {
            str = str.replace(/<\/?[^>]*>/g,'');
            str = str.replace(/[ | ]*\n/g,'\n');
            str=str.replace(/&nbsp;/ig,'');
            return str;
        }
    }
    exports.setting = function(uploadToken, saveKey) {
        // ### 头像上传
        // 初始化Web Uploader
        DATA.uploadToken = uploadToken;
        var uploader = WebUploader.create({
            auto: true,
            swf: '/app/_static/js/vendor/webuploader/Uploader.swf',
            server: 'https://up.qbox.me/',
            pick: '#avatarPicker',
            fileNumLimit: 1,
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            formData: {
                token: DATA.uploadToken,
                key: saveKey
            }
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function(file) {
            var $list = $("#authList");
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<img>' +
                        '<div class="info">' + file.name + '</div>' +
                    '</div>'
                    ),
                $img = $(".my-avatar");

            $("#avatarPicker").hide();
            $li.on('click', function(event) {
                $(this).remove();
                uploader.removeFile(uploader.getFile($(this).attr('id')));
                $("#avatarPicker").show();
            });

            // $list为容器jQuery实例
            $list.append($li);
            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            uploader.makeThumb(file, function(error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr( 'src', src );
            }, 100, 100);
        });

        // uploadBeforeSend
        uploader.on('uploadBeforeSend', function(obj, data, headers) {
            $("#u-tips").removeClass('hide');
            // $.extend(data, {
            //     'x:name': obj.file.__hash + String(Math.random())
            // });
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function(file, percentage) {

        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function(file, response) {
            // $("#id_card_pic").val(response.key);
            $("#u-tips").addClass('hide');
            layer.msg('上传成功');
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function(file, response) {
            $("#u-tips").addClass('hide');
            layer.msg('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function(file) {
            $("#u-tips").addClass('hide');
        });
        $(".save-profile").on('click', function(event) {
            var password = $.trim($("#new-password").val());
            var repassword = $.trim($("#re-password").val());

            if (password != '') {
                if (password.length < 8) {
                    layer.msg('密码长度不能少于八位', {icon: 2});
                    $('input[name=new-password]').focus();
                    return false;
                } else if (password != repassword) {
                    layer.msg('两次密码不一致', {icon: 2});
                    $('input[name=new-password]').focus();
                    return false;
                }
            }

            var that = this;
            var o = $(that).html();
            $(that).attr('disabled', 'disabled');
            $(that).html('<i class="fa fa-spinner fa-spin"></i> 保存中...');
            $.post('/save/profile/', {
                uid: $(that).data('uid'),
                email: $.trim($('#email').val()),
                phone: $.trim($('#phone').val()),
                password: password
            }, function(data) {
                if (data.status == 'success') {
                    layer.msg(data.data, {icon: 1});
                } else {
                    layer.msg(data.data, {icon: 2});
                }
                $(that).removeAttr('disabled');
                $(that).html(o);
            }, 'json');
        });
    }
    exports.scores = function(config) {
        var scores = config.scores;
        tpl = new Vue({
            el: '#scores-info',
            data: {
                scores: scores,
            }
        });
        $(document).ready(function() {
            $("#scores-info").attr('style', 'display: block;');
        });
    }
});
