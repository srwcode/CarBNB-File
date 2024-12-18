package com.project.carbnb.service.impl;

import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.entity.*;
import com.project.carbnb.repository.*;
import com.project.carbnb.service.ScheduleService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private ScheduleRepository scheduleRepository;
    private UserRepository userRepository;
    private SpotRepository spotRepository;
    private ReservationRepository reservationRepository;
    private ReviewRepository reviewRepository;
    private FileRepository fileRepository;

    public ScheduleServiceImpl(
            ScheduleRepository scheduleRepository,
            UserRepository userRepository,
            SpotRepository spotRepository,
            ReservationRepository reservationRepository,
            ReviewRepository reviewRepository,
            FileRepository fileRepository
    ) {
        this.scheduleRepository = scheduleRepository;
        this.userRepository = userRepository;
        this.spotRepository = spotRepository;
        this.reservationRepository = reservationRepository;
        this.reviewRepository = reviewRepository;
        this.fileRepository = fileRepository;
    }

    @Override
    public List<ScheduleDto> findAll() {
        List<Schedule> schedules = scheduleRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return schedules.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDto> findStatus() {
        List<Schedule> schedules = scheduleRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));
        return schedules.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDto> findByUserId(Long id) {
        List<Schedule> schedules = scheduleRepository.findByUserIdAndStatusIn(id, Arrays.asList((short) 1), Sort.by(Sort.Direction.DESC, "createdAt"));
        return schedules.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDto> findBySpotId(Long id) {
        List<Schedule> schedules = scheduleRepository.findBySpotAndStatusIn(id, Arrays.asList((short) 1), Sort.by(Sort.Direction.DESC, "createdAt"));
        return schedules.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public ScheduleDto findById(Long id) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("Schedule not found"));
        return convertEntityToDto(schedule);
    }

    @Override
    public Schedule findByScheduleId(Long id) {
        return scheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    @Override
    public ScheduleDto findByIdAndUserId(Long id, Long userId) {
        Schedule schedule = scheduleRepository.findByIdAndUserIdAndStatusIn(id, userId, Arrays.asList((short) 1)).orElseThrow(() -> new RuntimeException("Schedule not found"));
        return convertEntityToDto(schedule);
    }

    @Override
    public void storeData(ScheduleDto scheduleDto) {
        Schedule schedule = new Schedule();
        schedule.setId(scheduleDto.getId());
        schedule.setUser(scheduleDto.getUser());
        schedule.setSpot(scheduleDto.getSpot());
        schedule.setStatus(scheduleDto.getStatus());
        schedule.setPricePerHour(scheduleDto.getPricePerHour());
        schedule.setMinimumHour(scheduleDto.getMinimumHour());
        schedule.setCharger(scheduleDto.getCharger());
        schedule.setChargerPrice(scheduleDto.getChargerPrice());
        schedule.setDescription(scheduleDto.getDescription());
        schedule.setStartDateTime(scheduleDto.getStartDateTime().withSecond(0).withNano(0));
        schedule.setEndDateTime(scheduleDto.getEndDateTime().withSecond(0).withNano(0));
        scheduleRepository.save(schedule);
    }

    @Override
    public void updateData(ScheduleDto currentSchedule, ScheduleDto scheduleDto) {
        Schedule schedule = scheduleRepository.findById(currentSchedule.getId()).orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule.setUser(scheduleDto.getUser());
        schedule.setSpot(scheduleDto.getSpot());
        schedule.setStatus(scheduleDto.getStatus());
        schedule.setPricePerHour(scheduleDto.getPricePerHour());
        schedule.setMinimumHour(scheduleDto.getMinimumHour());
        schedule.setCharger(scheduleDto.getCharger());
        schedule.setChargerPrice(scheduleDto.getChargerPrice());
        schedule.setDescription(scheduleDto.getDescription());
        schedule.setStartDateTime(scheduleDto.getStartDateTime());
        schedule.setEndDateTime(scheduleDto.getEndDateTime());
        scheduleRepository.save(schedule);
    }

    @Override
    public void removeData(ScheduleDto currentSchedule) {
        Schedule schedule = scheduleRepository.findById(currentSchedule.getId()).orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule.setStatus((short) 3);
        scheduleRepository.save(schedule);
    }

    private ScheduleDto convertEntityToDto(Schedule schedule) {
        ScheduleDto scheduleDto = new ScheduleDto();
        scheduleDto.setId(schedule.getId());
        scheduleDto.setUser(schedule.getUser());
        scheduleDto.setSpot(schedule.getSpot());
        scheduleDto.setStatus(schedule.getStatus());
        scheduleDto.setPricePerHour(schedule.getPricePerHour());
        scheduleDto.setMinimumHour(schedule.getMinimumHour());
        scheduleDto.setCharger(schedule.getCharger());
        scheduleDto.setChargerPrice(schedule.getChargerPrice());
        scheduleDto.setDescription(schedule.getDescription());
        scheduleDto.setStartDateTime(schedule.getStartDateTime());
        scheduleDto.setEndDateTime(schedule.getEndDateTime());
        scheduleDto.setCreatedAt(schedule.getCreatedAt());
        scheduleDto.setUpdatedAt(schedule.getUpdatedAt());

        User user = userRepository.findById(schedule.getUser().getId()).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getImageId() != null) {
            File file = fileRepository.findById(user.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

            if (file != null) {
                scheduleDto.setUserImagePath(file.getPath());
            }
        }

        Spot spot = spotRepository.findBySpotId(schedule.getSpot()).orElseThrow(() -> new RuntimeException("Spot not found"));

        if (spot != null) {
            scheduleDto.setSpotName(spot.getName());
            scheduleDto.setSpotType(spot.getType());
            scheduleDto.setSpotLocation(spot.getLocation());
            scheduleDto.setSpotAddress(spot.getAddress());
            scheduleDto.setSpotDescription(spot.getDescription());
            scheduleDto.setSpotSizeWidth(spot.getSizeWidth());
            scheduleDto.setSpotSizeLength(spot.getSizeLength());
            scheduleDto.setSpotSizeHeight(spot.getSizeHeight());
            scheduleDto.setSpotLatitude(spot.getLatitude());
            scheduleDto.setSpotLongitude(spot.getLongitude());

            if (spot.getImageId() != null) {
                File file = fileRepository.findById(spot.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

                if (file != null) {
                    scheduleDto.setSpotImagePath(file.getPath());
                }
            }
        }


        List<Reservation> reservations = reservationRepository.findByScheduleIdAndStatusIn(schedule.getId(), Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Long> reservationIds = reservations.stream().map(Reservation::getId).collect(Collectors.toList());
        List<Review> reviews = reviewRepository.findByReservationInAndStatusIn(reservationIds, Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));

        Float totalRating = (float) 0;

        if (!reviews.isEmpty()) {
            for(Review review : reviews) {
                totalRating += review.getRating();
            }

            Float averageRating = totalRating/reviews.size();
            scheduleDto.setReviews(averageRating);
        }

        return scheduleDto;
    }
}