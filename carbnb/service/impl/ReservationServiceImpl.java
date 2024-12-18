package com.project.carbnb.service.impl;

import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.entity.*;
import com.project.carbnb.repository.*;
import com.project.carbnb.service.ReservationService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    private ReservationRepository reservationRepository;
    private VehicleRepository vehicleRepository;
    private SpotRepository spotRepository;
    private PaymentRepository paymentRepository;
    private ReviewRepository reviewRepository;
    private FileRepository fileRepository;

    public ReservationServiceImpl(
        ReservationRepository reservationRepository,
        VehicleRepository vehicleRepository,
        SpotRepository spotRepository,
        PaymentRepository paymentRepository,
        ReviewRepository reviewRepository,
        FileRepository fileRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.vehicleRepository = vehicleRepository;
        this.spotRepository = spotRepository;
        this.paymentRepository = paymentRepository;
        this.reviewRepository = reviewRepository;
        this.fileRepository = fileRepository;
    }

    @Override
    public List<ReservationDto> findAll() {
        List<Reservation> reservations = reservationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return reservations.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ReservationDto> findStatus() {
        List<Reservation> reservations = reservationRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2, (short) 3), Sort.by(Sort.Direction.DESC, "createdAt"));
        return reservations.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ReservationDto> findByUserId(Long id) {
        List<Reservation> reservations = reservationRepository.findByUserIdAndStatusIn(id, Arrays.asList((short) 1, (short) 2, (short) 3), Sort.by(Sort.Direction.DESC, "createdAt"));
        return reservations.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ReservationDto> findByScheduleId(Long id) {
        List<Reservation> reservations = reservationRepository.findByScheduleIdAndStatusIn(id, Arrays.asList((short) 1, (short) 2, (short) 3), Sort.by(Sort.Direction.DESC, "createdAt"));
        return reservations.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ReservationDto> findBySchedule(List<ScheduleDto> scheduleDto) {
        List<Long> schedules = scheduleDto.stream().map(ScheduleDto::getId).collect(Collectors.toList());
        List<Reservation> reservations = reservationRepository.findByScheduleIdInAndStatusIn(schedules, Arrays.asList((short) 1, (short) 2, (short) 3), Sort.by(Sort.Direction.DESC, "createdAt"));
        return reservations.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public ReservationDto findById(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        return convertEntityToDto(reservation);
    }

    @Override
    public Reservation findByReservationId(Long id) {
        return reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    @Override
    public ReservationDto findByIdAndUserId(Long id, Long userId) {
        Reservation reservation = reservationRepository.findByIdAndUserIdAndStatusIn(id, userId, Arrays.asList((short) 1, (short) 2, (short) 3)).orElseThrow(() -> new RuntimeException("Reservation not found"));
        return convertEntityToDto(reservation);
    }

    @Override
    public ReservationDto findByIdAndSchedule(Long id, List<ScheduleDto> scheduleDto) {
        List<Long> schedules = scheduleDto.stream().map(ScheduleDto::getId).collect(Collectors.toList());
        Reservation reservation = reservationRepository.findByIdAndScheduleIdInAndStatusIn(id, schedules, Arrays.asList((short) 1, (short) 2, (short) 3)).orElseThrow(() -> new RuntimeException("Reservation not found"));
        return convertEntityToDto(reservation);
    }


    @Override
    public void storeData(ReservationDto reservationDto) {
        Reservation reservation = new Reservation();
        reservation.setId(reservationDto.getId());
        reservation.setUser(reservationDto.getUser());
        reservation.setSchedule(reservationDto.getSchedule());
        reservation.setVehicle(reservationDto.getVehicle());
        reservation.setStatus(reservationDto.getStatus());
        reservation.setStartDateTime(reservationDto.getStartDateTime().withSecond(0).withNano(0));
        reservation.setEndDateTime(reservationDto.getEndDateTime().withSecond(0).withNano(0));
        reservationRepository.save(reservation);
    }

    @Override
    public void updateData(ReservationDto currentReservation, ReservationDto reservationDto) {
        Reservation reservation = reservationRepository.findById(currentReservation.getId()).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setUser(reservationDto.getUser());
        reservation.setSchedule(reservationDto.getSchedule());
        reservation.setVehicle(reservationDto.getVehicle());
        reservation.setStatus(reservationDto.getStatus());
        reservation.setStartDateTime(reservationDto.getStartDateTime());
        reservation.setEndDateTime(reservationDto.getEndDateTime());
        reservationRepository.save(reservation);
    }

    @Override
    public void removeData(ReservationDto currentReservation) {
        Reservation reservation = reservationRepository.findById(currentReservation.getId()).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus((short) 4);
        reservationRepository.save(reservation);
    }

    @Override
    public void cancelData(ReservationDto currentReservation) {
        Reservation reservation = reservationRepository.findById(currentReservation.getId()).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus((short) 3);
        reservationRepository.save(reservation);
    }

    @Override
    public long saveData(ReservationDto reservationDto) {
        Reservation reservation = new Reservation();
        reservation.setId(reservationDto.getId());
        reservation.setUser(reservationDto.getUser());
        reservation.setSchedule(reservationDto.getSchedule());
        reservation.setVehicle(reservationDto.getVehicle());
        reservation.setStatus(reservationDto.getStatus());
        reservation.setStartDateTime(reservationDto.getStartDateTime().withSecond(0).withNano(0));
        reservation.setEndDateTime(reservationDto.getEndDateTime().withSecond(0).withNano(0));
        reservationRepository.save(reservation);

        return reservation.getId();
    }


    private ReservationDto convertEntityToDto(Reservation reservation) {
        ReservationDto reservationDto = new ReservationDto();
        reservationDto.setId(reservation.getId());
        reservationDto.setUser(reservation.getUser());
        reservationDto.setSchedule(reservation.getSchedule());
        reservationDto.setVehicle(reservation.getVehicle());
        reservationDto.setStatus(reservation.getStatus());
        reservationDto.setStartDateTime(reservation.getStartDateTime());
        reservationDto.setEndDateTime(reservation.getEndDateTime());
        reservationDto.setCreatedAt(reservation.getCreatedAt());
        reservationDto.setUpdatedAt(reservation.getUpdatedAt());

        paymentRepository.findByReservationId(reservation.getId()).ifPresent(payment -> reservationDto.setAmount(payment.getAmount()));
        paymentRepository.findByReservationId(reservation.getId()).ifPresent(payment -> reservationDto.setMethod(payment.getMethod()));

        reviewRepository.findByReservationAndStatusIn(reservation.getId(), Arrays.asList((short) 1)).ifPresent(review -> reservationDto.setReviewId(review.getReviewId()));
        reviewRepository.findByReservationAndStatusIn(reservation.getId(), Arrays.asList((short) 1)).ifPresent(review -> reservationDto.setReviewRating(review.getRating()));
        reviewRepository.findByReservationAndStatusIn(reservation.getId(), Arrays.asList((short) 1)).ifPresent(review -> reservationDto.setReviewComment(review.getComment()));

        Vehicle vehicle = vehicleRepository.findByVehicleId(reservation.getVehicle()).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        Spot spot = spotRepository.findBySpotId(reservation.getSchedule().getSpot()).orElseThrow(() -> new RuntimeException("Spot not found"));

        if (spot != null) {
            reservationDto.setSpotId(spot.getSpotId());
            reservationDto.setSpotName(spot.getName());
            reservationDto.setSpotType(spot.getType());
            reservationDto.setSpotLocation(spot.getLocation());
            reservationDto.setSpotAddress(spot.getAddress());
            reservationDto.setSpotDescription(spot.getDescription());
            reservationDto.setSpotSizeWidth(spot.getSizeWidth());
            reservationDto.setSpotSizeLength(spot.getSizeLength());
            reservationDto.setSpotSizeHeight(spot.getSizeHeight());
            reservationDto.setSpotLatitude(spot.getLatitude());
            reservationDto.setSpotLongitude(spot.getLongitude());

            if (spot.getImageId() != null) {
                File spotFile = fileRepository.findById(spot.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

                if (spotFile != null) {
                    reservationDto.setSpotImagePath(spotFile.getPath());
                }
            }
        }

        if (vehicle != null) {
            reservationDto.setVehicleType(vehicle.getType());
            reservationDto.setVehicleLicensePlate(vehicle.getLicensePlate());
            reservationDto.setVehicleProvince(vehicle.getProvince());
            reservationDto.setVehicleBrand(vehicle.getBrand());
            reservationDto.setVehicleModel(vehicle.getModel());
            reservationDto.setVehicleColor(vehicle.getColor());

            if (vehicle.getImageId() != null) {
                File file = fileRepository.findById(vehicle.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

                if (file != null) {
                    reservationDto.setImagePath(file.getPath());
                }
            }
        }

        return reservationDto;
    }
}