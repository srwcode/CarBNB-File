package com.project.carbnb.service;

import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.entity.Reservation;
import java.util.List;

public interface ReservationService {
    List<ReservationDto> findAll();
    List<ReservationDto> findStatus();
    List<ReservationDto> findByUserId(Long id);
    List<ReservationDto> findByScheduleId(Long id);
    List<ReservationDto> findBySchedule(List<ScheduleDto> scheduleDto);
    ReservationDto findById(Long id);
    ReservationDto findByIdAndUserId(Long id, Long userId);
    ReservationDto findByIdAndSchedule(Long id, List<ScheduleDto> scheduleDto);
    Reservation findByReservationId(Long id);
    void storeData(ReservationDto reservationDto);
    void updateData(ReservationDto reservation, ReservationDto reservationDto);
    void removeData(ReservationDto reservation);
    void cancelData(ReservationDto reservation);
    long saveData(ReservationDto reservationDto);
}
