# Code of conduct

### 使用2个空格进行缩进

```javascript
  function hello (name) {
    console.log('Hi, ' + name);
  }
```

### 云存储集合名采用 `_` 连接多个单词

**Bad:**

```javascript
db.createCollection('cardLikeRecord')
db.createCollection('card-like-record')
db.createCollection('cardlikerecord')
```

**Good:**

```javascript
db.createCollection('card_like_record')
```

### 云存储属性名

- 多个单词使用下划线 `_` 连接

- 索引使用小程序提供的 `_id`

- 用户的 openID 统一使用 `openid`

- 记录统一增加 `create_at` 和 `update_at` 两个属性

**Bad:**

```json
{
  "id": 12,
  "openID": "useropenid"
}
```

**Good:**

```json
{
  "_id": "randomstring",
  "openid": "useropenid",
  "create_at": "db.serverDate()",
  "update_at": "db.seerverDate()"
}
```

