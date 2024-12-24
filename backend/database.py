from flask import Flask  
from flask_sqlalchemy import SQLAlchemy  

db = SQLAlchemy()  # 创建 SQLAlchemy 实例  

def create_app():   # 创建 Flask 应用实例
    app = Flask(__name__)  
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///players.db'  # 配置数据库连接信息
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False    #
    db.init_app(app)  # 需要将 app 传递给 db  
    return app