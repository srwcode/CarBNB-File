package com.project.carbnb.controller.member;

import com.project.carbnb.dto.BookmarkDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.service.ScheduleService;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("member/bookmarks")
public class MemberBookmarkController {
    
    private BookmarkService bookmarkService;
    private UserService userService;
    private ScheduleService scheduleService;

    public MemberBookmarkController(BookmarkService bookmarkService, UserService userService, ScheduleService scheduleService) {
        this.bookmarkService = bookmarkService;
        this.userService = userService;
        this.scheduleService = scheduleService;
    }

    @PostMapping("/show/{id}")
    public BookmarkDto show(@PathVariable Long id) {
        ScheduleDto schedule = scheduleService.findById(id);
        BookmarkDto bookmark = bookmarkService.findByUserIdAndSpotId(userService.userAuth().getId(), schedule.getSpot());

        if(bookmark != null) {
            return bookmark;
        } else {
            BookmarkDto bookmarkDto = new BookmarkDto();
            bookmarkDto.setStatus((short) 2);
            return bookmarkDto;
        }
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Integer> update(@PathVariable Long id) {
        int updated = 0;

        BookmarkDto bookmarkDto = new BookmarkDto();
        ScheduleDto schedule = scheduleService.findById(id);
        BookmarkDto bookmark = bookmarkService.findByUserIdAndSpotId(userService.userAuth().getId(), schedule.getSpot());

        if(bookmark != null) {
            bookmarkDto.setUser(bookmark.getUser());
            bookmarkDto.setSpot(bookmark.getSpot());

            if(bookmark.getStatus() == 1) {
                bookmarkDto.setStatus((short) 2);
                bookmarkService.updateData(bookmark, bookmarkDto);
                updated = 2;
            } else if(bookmark.getStatus() == 2) {
                bookmarkDto.setStatus((short) 1);
                bookmarkService.updateData(bookmark, bookmarkDto);
                updated = 1;
            }

        } else {
            bookmarkDto.setUser(userService.userAuth());
            bookmarkDto.setSpot(schedule.getSpot());
            bookmarkDto.setStatus((short) 1);
            bookmarkService.storeData(bookmarkDto);
            updated = 1;
        }

        return ResponseEntity.ok(updated);
    }



    @PostMapping("/spot/show/{id}")
    public BookmarkDto spotShow(@PathVariable Long id) {
        BookmarkDto bookmark = bookmarkService.findByUserIdAndSpotId(userService.userAuth().getId(), id);

        if(bookmark != null) {
            return bookmark;
        } else {
            BookmarkDto bookmarkDto = new BookmarkDto();
            bookmarkDto.setStatus((short) 2);
            return bookmarkDto;
        }
    }

    @PostMapping("/spot/update/{id}")
    public ResponseEntity<Integer> spotUpdate(@PathVariable Long id) {
        int updated = 0;

        BookmarkDto bookmarkDto = new BookmarkDto();
        BookmarkDto bookmark = bookmarkService.findByUserIdAndSpotId(userService.userAuth().getId(), id);

        if(bookmark != null) {
            bookmarkDto.setUser(bookmark.getUser());
            bookmarkDto.setSpot(bookmark.getSpot());

            if(bookmark.getStatus() == 1) {
                bookmarkDto.setStatus((short) 2);
                bookmarkService.updateData(bookmark, bookmarkDto);
                updated = 2;
            } else if(bookmark.getStatus() == 2) {
                bookmarkDto.setStatus((short) 1);
                bookmarkService.updateData(bookmark, bookmarkDto);
                updated = 1;
            }

        } else {
            bookmarkDto.setUser(userService.userAuth());
            bookmarkDto.setSpot(id);
            bookmarkDto.setStatus((short) 1);
            bookmarkService.storeData(bookmarkDto);
            updated = 1;
        }

        return ResponseEntity.ok(updated);
    }
}