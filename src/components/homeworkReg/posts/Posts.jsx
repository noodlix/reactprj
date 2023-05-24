import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUsers } from "../../../store/userSlice";

import s from './posts.module.scss';

const Posts = ({ posts }) => {
  const {users} = useSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch])
  return (
      <div className={s.posts}>
        <div className={s.posts_grid}>
          {
            posts.map(post => {
                const {name} = users.find(user => Number(user.id) === Number(post.user));
                return (
                    <div className={s.grid__item} key={post.id}>
                        <Link to={"/posts/" + post.id}>
                            <div className={s.postImg}>
                            <img src={post.img} alt="postImage" className={s.fill} />
                            </div>
                            <div className={s.post__userName}>{name}</div>
                            <div className={s.post__title}>{post.title}</div>
                        </Link>
                    </div>
                )
            })
          }
        </div>
      </div>
  );
};

export default Posts;
