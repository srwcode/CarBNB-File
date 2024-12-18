package com.project.carbnb.service;

import com.project.carbnb.dto.BookmarkDto;

import java.util.List;

public interface BookmarkService {
    List<BookmarkDto> findAll();
    List<BookmarkDto> findStatus();
    List<BookmarkDto> findByUserId(Long id);
    BookmarkDto findByUserIdAndSpotId(Long userId, Long spotId);
    void storeData(BookmarkDto bookmarkDto);
    void updateData(BookmarkDto bookmark, BookmarkDto bookmarkDto);
    void removeData(BookmarkDto bookmark);
}
