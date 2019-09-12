//ui-search定义
$.fn.UiSearch = function () {
	// body...
	var ui = $(this);
	$('.ui-search-selected', ui).on('click', function () {
		// body...
		$('.ui-search-select-list').show();
		return false;
	});
	$('.ui-search-select-list a', ui).on('click', function () {
		// body...
		$('.ui-search-selected').text($(this).text());
		$('.ui-search-select-list').hide();
		return false;
	});
	$('body').on('click', function () {
		// body...
		$('.ui-search-select-list').hide();
	})
}

//ui-tab定义
/*header tab组件,所有选项卡.item
  content tab组件，所有选项卡内容区域.item
  focus_prefix选项卡高亮样式前缀
*/
$.fn.UiTab = function (header, content, focus_prefix) {
	// body...
	var ui = $(this);
	var tabs= $(header, ui);
	var cons = $(content, ui);
	var focus_prefix = focus_prefix || '';

	tabs.on('click', function () {
		// body...
		var index = $(this).index();
		tabs.removeClass(focus_prefix + 'item_focus').eq(index).addClass(focus_prefix + 'item_focus');
		cons.hide().eq(index).show();
		return false;
	})
}

//ui-tabtop
$.fn.UiBackTop = function () {
	// body...
	var ui = $(this);
	var el = $('<div class="ui-backTop" href="#"></div>');
	ui.append(el);

	var windowHeight = $(window).height();

	$(window).on('scroll', function () {
		// body...
		var top = $('body').scrollTop();
		if (top > windowHeight) {
			el.show();
		}else{
			el.hide();
		}
	});
	el.on('click', function () {
		// body...
		$(window).scrollTop(0);
	});
}

//ui-slider 幻灯片
$.fn.uiSlider  =function(){
	var wrap =  $('.ui-slider-wrap',this);
	var size = $('.item',wrap).size()-1;
	

	var goPrev = $('.ui-slider-arrow .left',this);
	var goNext = $('.ui-slider-arrow .right',this);

	var items = $('.item',wrap);
	var tips  = $('.ui-slider-process .item',this);
	var width =  items.eq(0).width();

	var currentIndex = 0;
	var autoMove = true;

	//	1.基本事件
	wrap
	.on('resetFocus',function(evt,isAutoMove){

		// if(autoMove === true &&)

		tips.removeClass('item_focus').eq(currentIndex).addClass('item_focus');
		wrap.animate({left:currentIndex*width*-1});
	})
	.on('nextFocus',function(){

		currentIndex = currentIndex+1 > size ? 0 : currentIndex+1;
		$(this).triggerHandler('resetFocus');

		// 4. 链式调用
		return $(this);

	})
	.on('prevFocus',function(){
		currentIndex = currentIndex-1 < 0 ? size : currentIndex-1;
		$(this).triggerHandler('resetFocus');

	})
	.on('autoMove',function(){
		// 2. 自动处理
		if(autoMove == true){
			setTimeout(function(){
				// 3. 闭包 && 链式调用
				wrap.triggerHandler('nextFocus').triggerHandler('autoMove');
			},5000);
		}
	}).triggerHandler('autoMove');


	goPrev.on('click',function(){
		wrap.triggerHandler('prevFocus');
		return false;
	});
	goNext.on('click',function(){
		wrap.triggerHandler('nextFocus');
		return false;
	});

	//	5.任务 BUG 排除（定时器BUG	）

}


//	从远程获得数据（一般在后台处理）
var getData = function(k,v){

	//	初始化获取所有城区
	if( k === undefined){
		return [{id:1,name:'东城区'},{id:2,name:'西城区'}];
	}
	//	根据城区获得下面的等级（不同城区相同等级的 id 不一样）
	if( k === 'area' ){
		var levelData = {
			1:[  {id:11,name:'一级医院'},{ id:12,name:'二级医院'} ],
			2:[  {id:22,name:'二级医院'} ]
		}
		return levelData[v] || [];
	}
	//	根据等级获取医院
	if( k === 'level'){
		var hospital = {
			11 : [  {id:1,name:'A1医院'},{id:2,name:'A2医院'} ],
			12 : [  {id:3,name:'B1医院'} ],
			22 : [  {id:4,name:'C1医院'},{id:5,name:'C2医院'} ]

		}

		return hospital[v] || [];

	}
	//	根据名称获取科室（科室都是依附在医院下面的）
	if( k === 'name'){
		var department = {
			1 : [  {id:1,name:'骨科'},{id:2,name:'内科'} ],
			2 : [  {id:3,name:'儿科'} ],
			3 : [  {id:4,name:'骨科'},{id:5,name:'内科'} ],
			4 : [  {id:6,name:'儿科'} ],
			5 : [  {id:7,name:'骨科'},{id:8,name:'内科'} ]

		}

		return department[v] || [];
	}
	return [];
}




$.fn.uiCascading = function(){

	//	每个select更新，就清理后面所有 select 为初始化状态
	//	并且根据当前 select 的值，获得下一个 select 的数据，并且更新
	var ui = $(this);
	var listSelect = $('select',this);


	//	每个select
	listSelect

		.on('updateOptions',function(evt,ajax){
			
			var select = $(this);

			select.find('option[value!=-1]').remove();
			if(ajax.data.length<1){
				return true;
			}
			for(var i=0,j=ajax.data.length;i<j;i++){
				var k = ajax.data[i].id;
				var v = ajax.data[i].name;
				select.append( $('<option>').attr('value',k).text(v) );
			}
			return true;
		})
		.on('change',function(){

			var changeIndex = listSelect.index(this);

			var k = $(this).attr('name');
			var v = $(this).val();

			var data  = getData(k,v);

			listSelect.eq(changeIndex+1).triggerHandler('updateOptions',{ data:data });
			
			ui.find('select:gt('+(changeIndex+1)+')').each(function(){
				$(this).triggerHandler('updateOptions',{ data:[] });	
			})
		})


		//	初始化
		listSelect.find('option:first').attr('value','-1');	//	特殊初始值标记

		listSelect.eq(0).triggerHandler('updateOptions',{ data:getData() }); // apply 传参


}



//页面的脚本逻辑
$(function () {
	// body...
	$('.ui-search').UiSearch();

	$('.content-tab').UiTab('.caption > .item ' , ' .block > .item');

	$('.content-tab .block .item').UiTab('.block-caption > a ' , ' .block-content > .block-wrap', 'block-caption-');

	$('body').UiBackTop();

	$('.ui-slider').uiSlider();


	$('.ui-cascading').uiCascading();
});