package com.project.carbnb.service.impl;

import com.project.carbnb.dto.BookmarkDto;
import com.project.carbnb.entity.Bookmark;
import com.project.carbnb.entity.Spot;
import com.project.carbnb.repository.BookmarkRepository;
import com.project.carbnb.repository.SpotRepository;
import com.project.carbnb.service.BookmarkService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    private BookmarkRepository bookmarkRepository;
    private SpotRepository spotRepository;

    public BookmarkServiceImpl(BookmarkRepository bookmarkRepository, SpotRepository spotRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.spotRepository = spotRepository;
    }

    @Override
    public List<BookmarkDto> findAll() {
        List<Bookmark> bookmarks = bookmarkRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return bookmarks.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<BookmarkDto> findStatus() {
        List<Bookmark> bookmarks = bookmarkRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));
        return bookmarks.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public BookmarkDto findByUserIdAndSpotId(Long userId, Long spotId) {
        return bookmarkRepository.findByUserIdAndSpot(userId, spotId).map(this::convertEntityToDto).orElse(null);
    }

    @Override
    public List<BookmarkDto> findByUserId(Long id) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdAndStatusIn(id, Arrays.asList((short) 1), Sort.by(Sort.Direction.DESC, "createdAt"));
        return bookmarks.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public void storeData(BookmarkDto bookmarkDto) {
        Bookmark bookmark = new Bookmark();
        bookmark.setUser(bookmarkDto.getUser());
        bookmark.setStatus(bookmarkDto.getStatus());
        bookmark.setSpot(bookmarkDto.getSpot());
        bookmarkRepository.save(bookmark);
    }

    @Override
    public void updateData(BookmarkDto currentBookmark, BookmarkDto bookmarkDto) {
        Bookmark bookmark = bookmarkRepository.findByUserIdAndSpot(currentBookmark.getUser().getId(), currentBookmark.getSpot()).orElseThrow(() -> new RuntimeException("Bookmark not found"));
        bookmark.setStatus(bookmarkDto.getStatus());
        bookmarkRepository.save(bookmark);
    }

    @Override
    public void removeData(BookmarkDto currentBookmark) {
        Bookmark bookmark = bookmarkRepository.findByUserIdAndSpot(currentBookmark.getUser().getId(), currentBookmark.getSpot()).orElseThrow(() -> new RuntimeException("Bookmark not found"));
        bookmarkRepository.delete(bookmark);
    }

    private BookmarkDto convertEntityToDto(Bookmark bookmark) {
        BookmarkDto bookmarkDto = new BookmarkDto();
        bookmarkDto.setUser(bookmark.getUser());
        bookmarkDto.setSpot(bookmark.getSpot());
        bookmarkDto.setStatus(bookmark.getStatus());
        bookmarkDto.setCreatedAt(bookmark.getCreatedAt());
        bookmarkDto.setUpdatedAt(bookmark.getUpdatedAt());

        Spot spot = spotRepository.findBySpotId(bookmark.getSpot()).orElseThrow(() -> new RuntimeException("Spot not found"));
        bookmarkDto.setSpotName(spot.getName());

        return bookmarkDto;
    }
}