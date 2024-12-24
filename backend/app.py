from flask import Flask, request, jsonify  
from flask_cors import CORS   

app = Flask(__name__)  
CORS(app)  

# 存储用户数据（示例，实际应储存在数据库中）  
users = {}  

#定义根路由，当访问根 URL 时，返回一个简单的欢迎消息。
@app.route('/')  
def index():  
    return "欢迎来到五子棋游戏！"  

@app.route('/register', methods=['POST'])  
def register():  
    data = request.get_json()  # 获取 JSON 数据  
    if not data or 'nickname' not in data or 'password' not in data:  
        return jsonify(success=False, message='请求无效，缺少必需字段'), 400  # 返回错误信息  

    nickname = data['nickname']  
    password = data['password']  

    if nickname in users:  # 检查昵称是否已存在  
        return jsonify(success=False, message='昵称已存在'), 400  # 返回昵称已存在的错误  

    # 注册新用户  
    users[nickname] = {'password': password, 'victories': 0}  
    return jsonify(success=True), 200  # 返回注册成功的信息  


@app.route('/record_score', methods=['POST'])  
def record_score():  
    data = request.get_json()  

    if not data or 'nickname' not in data or 'victories' not in data:  
        return jsonify(success=False, message='请求无效，缺少必需字段'), 400  

    nickname = data['nickname']  
    victories = data['victories']  

    if nickname in users:  # 检查是否存在该用户  
        if victories:  
            users[nickname]['victories'] += victories  # 更新胜场  
        return jsonify(success=True), 200  
    
    return jsonify(success=False, message='用户未找到'), 400  

if __name__ == '__main__':  
    app.run(debug=True)  # 启动应用