 #从 flask_sqlalchemy 包中导入 SQLAlchemy 类，以便在 Flask 应用中使用 ORM 功能进行数据库操作。
from flask_sqlalchemy import SQLAlchemy 
#创建一个 SQLAlchemy 数据库实例 db，后续将用于定义数据模型和与数据库的交互。
db = SQLAlchemy()  

class Player(db.Model):  
    id = db.Column(db.Integer, primary_key=True)    # 玩家 ID，
    nickname = db.Column(db.String(50), unique=True, nullable=False)  # 玩家昵称
    password = db.Column(db.String(150), nullable=False)  # 玩家密码
    victories = db.Column(db.Integer, default=0)   # 玩家胜场数
    total_games = db.Column(db.Integer, default=0)   # 玩家总场数

#
    def __repr__(self):   
        return f"<Player {self.nickname}>"  # 返回玩家信息