package com.project.carbnb.service;

import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.entity.Schedule;

import java.util.List;

public interface ScheduleService {
    List<ScheduleDto> findAll();
    List<ScheduleDto> findStatus();
    List<ScheduleDto> findByUserId(Long id);
    List<ScheduleDto> findBySpotId(Long id);
    ScheduleDto findById(Long id);
    ScheduleDto findByIdAndUserId(Long id, Long userId);
    Schedule findByScheduleId(Long id);
    void storeData(ScheduleDto scheduleDto);
    void updateData(ScheduleDto schedule, ScheduleDto scheduleDto);
    void removeData(ScheduleDto schedule);
}
