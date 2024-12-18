package com.project.carbnb.service;

import com.project.carbnb.dto.BookmarkDto;
import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.dto.SpotDto;
import java.util.List;

public interface SpotService {
    List<SpotDto> findAll();
    List<SpotDto> findStatus();
    List<SpotDto> findByUserId(Long id);
    List<SpotDto> findByBookmark(List<BookmarkDto> bookmarkDto);
    SpotDto findById(Long id);
    SpotDto findByIdAndUserId(Long id, Long userId);
    void storeData(SpotDto spotDto);
    void updateData(SpotDto spot, SpotDto spotDto);
    void removeData(SpotDto spot);
}
