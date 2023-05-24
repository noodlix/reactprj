import React, { useState, useEffect } from "react";

import ProfileRouter from "../../../components/homeworkReg/profileRouter";
import { Link, useParams } from "react-router-dom";
import Posts from "../../../components/homeworkReg/posts/Posts";


import { useSelector, useDispatch } from "react-redux";
import { getUserById, changeData } from "../../../store/userSlice";

import s from "./userPage.module.scss";
const UserPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user, userById } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  
  const [hisPosts, setHisPosts] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  const lastIndex = currentPage * postsPerPage;
  const firstIndex = lastIndex - postsPerPage;
  const currentPosts = hisPosts.slice(firstIndex, lastIndex);

  const disabledNext = Math.ceil(hisPosts.length / 3) > currentPage;
  const disabledPrev = currentPage > 1;

  const prevPage = () => setCurrentPage(prev => prev - 1);
  const nextPage = () => setCurrentPage(prev => prev + 1);

  const [friend, setFriend] = useState(null);
  const [hasPosts, setHasPosts] = useState(false);


  useEffect(() => {
    let yourPosts = posts.map(post => {
      if (Number(post.user) === Number(id)) {
        return post
      } 
    });
    yourPosts = yourPosts.filter(post => post);
    setHisPosts(yourPosts);
  }, [posts, id]);

  useEffect(() => {
    dispatch(getUserById(id));
    user.friends.find((friend) => {
      if (Number(friend) === Number(id)) {
        setFriend(true);
      }
    });
  }, [dispatch, id, user.friends]);

  useEffect(() => {
    posts.find((post) => {
      if (Number(post.user) === Number(id)) {
        setHasPosts(true);
      }
    });
  }, [id, posts]);

  const switchFriend = () => {
    if (!friend) {
      dispatch(changeData({ ...user, friends: [...user.friends, Number(id)] }));
      setFriend(true);
    } else {
      dispatch(
        changeData({
          ...user,
          friends: user.friends.filter((friend) => friend !== Number(id)),
        })
      );
      setFriend(false);
    }
  };

  return (
    <>
      <ProfileRouter />
      <div className={s.user}>
        <div className={s.profile}>
          <div className={s.profile__info}>
            <div className={s.profile__bio}>
              <div className={s.profile__avatar}>
                <img src={userById?.avatar} alt="avatar" className={s.avatar}/>
              </div>
              <div className={s.profile__personalData}>
                <div className={s.profile__name}>
                  {userById?.name ? (
                    userById?.name
                  ) : (
                    <h3>He doesn't have a nickname</h3>
                  )}
                </div>
                <div className={s.profile__email}>{userById?.email}</div>
                <div className={s.profile__description}>{userById?.description}</div>
                <button className={s.profile__follow} onClick={switchFriend}>
                  {friend ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          </div>
          {hasPosts && (
            <>  
              <Posts posts={currentPosts}/>
              <div className={s.profile__pagination}>
              <button className={s.profile__pagination_button} style={{opacity: !disabledPrev ? 0.4: 1}} onClick={prevPage} disabled={!disabledPrev}>Prev</button>
                <button className={s.profile__pagination_button} style={{opacity: !disabledNext ? 0.4: 1}} onClick={nextPage} disabled={!disabledNext}>Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPage;
