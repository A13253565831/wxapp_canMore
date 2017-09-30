var Form = (function () {
	/**
	 * 默认构造器
	 */
	function Form() {
		/**
		 * 数据源
		 * @type {Array}
		 */
		this.data = [];
		/**
		 * 选择分组的索引
		 * @type {number}
		 */
		this.groupIndex = 0;
	}

	/**
	 * 添加一个组
	 * @param {string} title
	 * @param {boolean} [isShowTitle]
	 * @return {Form}
	 */
	Form.prototype.addGroup = function (title, isShowTitle) {
		if (isShowTitle === void 0) {
			isShowTitle = true;
		}
		this.data.push({title: title, is_show_title: isShowTitle, controls: {}});
		this.useGroup(this.data.length - 1);
		return this;
	};
	/**
	 * 删除分组
	 * @param {number} index
	 * @return {Form}
	 */
	Form.prototype.removeGroup = function (index) {
		this.data.splice(index, 1);
		return this;
	};
	/**
	 * 选择分组
	 * @param {number} index
	 * @return {Form}
	 */
	Form.prototype.useGroup = function (index) {
		this.groupIndex = index;
		return this;
	};
	/**
	 * 清除数据
	 * @return {Form}
	 */
	Form.prototype.clear = function () {
		this.data = [];
		return this;
	};
	/**
	 * 添加字段
	 * @param {string} type
	 * @param {string} label
	 * @param {string} name
	 * @param {Object} value
	 * @param {Object} extra
	 * @param {string} placeholder
	 */
	Form.prototype.setField = function (type, label, name, value, extra, placeholder) {
		if (value === void 0) {
			value = null;
		}
		if (extra === void 0) {
			extra = null;
		}
		if (placeholder === void 0) {
			placeholder = "";
		}
		var controls = this.data[this.groupIndex].controls;
		controls[name] = {type: type, label: label, extra: extra, placeholder: placeholder,};
		this.setFieldValue(this.groupIndex, name, value);
		return this;
	};
	/**
	 * 设置字段的值
	 * @param {number} group
	 * @param {string} name
	 * @param {Object} value
	 */
	Form.prototype.setFieldValue = function (group, name, value) {
		var control = this.data[group].controls[name];
		var date = new Date(), dateStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
			timeStr = date.getHours() + ":" + date.getMinutes();
		if (control.type === Form.FieldType.checkbox) {
			control.value = {};
			for (var x in control.extra) {
				if (value.indexOf(x) !== -1) {
					control.value[x] = 1;
				}
			}
		}
		else if (control.type === Form.FieldType.datetime) {
			control.value = value.split(" ", 2);
			if (!control.value[0]) control.value[0] = dateStr;
			if (!control.value[1]) control.value[1] = timeStr;
		} else if (control.type === Form.FieldType.date) {
			control.value = !value ? dateStr : value;
		} else if (control.type === Form.FieldType.time) {
			control.value = !value ? timeStr : value;
		}
		else {
			control.value = value;
		}
	};
	/**
	 * 获取字段扩展属性
	 * @param {number} group
	 * @param {string} name
	 * @return {Object}
	 */
	Form.prototype.getFieldExtra = function (group, name) {
		var controls = this.data[group].controls;
		return controls[name].extra;
	};
	/**
	 * 删除字段
	 * @param {string} name
	 * @return {Form}
	 */
	Form.prototype.removeField = function (name) {
		var controls = this.data[this.groupIndex].controls;
		delete controls[name];
		return this;
	};
	/**
	 * 应用数据
	 */
	Form.prototype.apply = function (page) {
		var _this = this;
		//绑定相关事件
		if (!page.onBindChange) {
			page.onBindChange = function (e) {
				var name = e.currentTarget.dataset.name;
				var group = e.currentTarget.dataset.group;
				var type = e.currentTarget.dataset.type;
				var value = e.detail.value;
				if (type === Form.FieldType.datetime) {
					var childType = e.currentTarget.dataset.childType;
					var tmpValue = _this.data[_this.groupIndex].controls[name].value;
					tmpValue[childType === 'date' ? 0 : 1] = value;
					value = tmpValue.join(" ");
				}
				_this.setFieldValue(group, name, value);
				if (e.type === 'change') {
					page.setData({formData: _this.toArray()});
				}
			};
		}
		page.setData({formData: this.toArray()});
	};
	/**
	 * 返回数据源
	 * @return {Array}
	 */
	Form.prototype.toArray = function () {
		return this.data;
	};
	return Form;
}());
/**
 * 字段类型
 * @type {{text: string; number: string; idcard: string; digit: string; textarea: string;
  * checkbox: string; radio: string; datetime: string; date: string; time: string}}
 */
Form.FieldType = {
	text: 'text',
	number: 'number',
	idcard: 'idcard',
	digit: 'digit',
	textarea: 'textarea',
	checkbox: 'checkbox',
	radio: 'radio',
	datetime: 'datetime',
	date: 'date',
	time: 'time',
};
module.exports = Form;
