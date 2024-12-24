from flask import Blueprint, request, jsonify  

app_routes = Blueprint('app_routes', __name__)  

# 存储用户数据  
users = {}  

@app_routes.route('/register', methods=['POST'])  
def register():  
    data = request.get_json()  

    if not data or 'nickname' not in data or 'password' not in data:  
        return jsonify(success=False, message='请求无效，缺少必需字段'), 400  

    nickname = data['nickname']  
    password = data['password']  

    if nickname in users:  # 检查昵称是否已存在  
        return jsonify(success=False, message='昵称已存在'), 400  

    # 注册新用户  
    users[nickname] = {'password': password, 'victories': 0}  
    return jsonify(success=True), 200  

@app_routes.route('/record_score', methods=['POST'])  
def record_score():  
    data = request.get_json()  
    nickname = data.get('nickname')  
    victories = data.get('victories')  

    if nickname in users:  
        if victories:  
            users[nickname]['victories'] += 1  
        return jsonify(success=True), 200  
    return jsonify(success=False, message='用户未找到'), 400