package com.project.carbnb.service.impl;

import com.project.carbnb.dto.BookmarkDto;
import com.project.carbnb.dto.SpotDto;
import com.project.carbnb.entity.Spot;
import com.project.carbnb.entity.File;
import com.project.carbnb.entity.User;
import com.project.carbnb.repository.FileRepository;
import com.project.carbnb.repository.SpotRepository;
import com.project.carbnb.repository.UserRepository;
import com.project.carbnb.service.SpotService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SpotServiceImpl implements SpotService {

    private SpotRepository spotRepository;
    private UserRepository userRepository;
    private FileRepository fileRepository;

    public SpotServiceImpl(SpotRepository spotRepository, UserRepository userRepository, FileRepository fileRepository) {
        this.spotRepository = spotRepository;
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
    }

    @Override
    public List<SpotDto> findAll() {
        List<Spot> spots = spotRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return spots.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<SpotDto> findStatus() {
        List<Spot> spots = spotRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));
        return spots.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<SpotDto> findByUserId(Long id) {
        List<Spot> spots = spotRepository.findByUserAndStatusIn(id, Arrays.asList((short) 1), Sort.by(Sort.Direction.DESC, "createdAt"));
        return spots.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<SpotDto> findByBookmark(List<BookmarkDto> bookmarkDto) {
        List<BookmarkDto> sortedBookmarks = bookmarkDto.stream()
                .sorted(Comparator.comparing(BookmarkDto::getUpdatedAt).reversed())
                .collect(Collectors.toList());

        List<Long> spotIds = sortedBookmarks.stream()
                .map(BookmarkDto::getSpot)
                .collect(Collectors.toList());

        List<Spot> spots = spotRepository.findBySpotIdInAndStatusIn(spotIds, Arrays.asList((short) 1));

        List<SpotDto> spotDtos = spots.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());

        List<SpotDto> sortedSpotDtos = new ArrayList<>();
        for (BookmarkDto bookmark : sortedBookmarks) {
            for (SpotDto spotDto : spotDtos) {
                if (spotDto.getSpotId().equals(bookmark.getSpot())) {
                    sortedSpotDtos.add(spotDto);
                    break;
                }
            }
        }

        return sortedSpotDtos;
    }

    @Override
    public SpotDto findById(Long id) {
        Spot spot = spotRepository.findBySpotId(id).orElseThrow(() -> new RuntimeException("Spot not found"));
        return convertEntityToDto(spot);
    }

    @Override
    public SpotDto findByIdAndUserId(Long id, Long userId) {
        Spot spot = spotRepository.findBySpotIdAndUserAndStatusIn(id, userId, Arrays.asList((short) 1)).orElseThrow(() -> new RuntimeException("Spot not found"));
        return convertEntityToDto(spot);
    }


    @Override
    public void storeData(SpotDto spotDto) {
        Spot spot = new Spot();
        spot.setSpotId(spotRepository.count() + 1);
        spot.setUser(spotDto.getUser());
        spot.setStatus(spotDto.getStatus());
        spot.setName(spotDto.getName());
        spot.setType(spotDto.getType());
        spot.setLocation(spotDto.getLocation());
        spot.setAddress(spotDto.getAddress());
        spot.setDescription(spotDto.getDescription());
        spot.setSizeWidth(spotDto.getSizeWidth());
        spot.setSizeLength(spotDto.getSizeLength());
        spot.setSizeHeight(spotDto.getSizeHeight());
        spot.setImageId(spotDto.getImageId());
        spot.setCreatedAt(Instant.now());
        spot.setUpdatedAt(Instant.now());

        try {
            double[] coordinates = extractCoordinates(spotDto.getLocation());
            if (coordinates != null) {
                spot.setLatitude(coordinates[0]);
                spot.setLongitude(coordinates[1]);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error extracting coordinates: " + e.getMessage());
        }

        spotRepository.save(spot);
    }

    private double[] extractCoordinates(String googleMapUrl) throws Exception {
        double[] coordinates = null;

        Pattern pattern = Pattern.compile("@(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)");
        Matcher matcher = pattern.matcher(googleMapUrl);

        if (matcher.find()) {
            double latitude = Double.parseDouble(matcher.group(1));
            double longitude = Double.parseDouble(matcher.group(2));
            coordinates = new double[] { latitude, longitude };
        } else {
            String redirectedUrl = getRedirectUrl(googleMapUrl);
            matcher = pattern.matcher(redirectedUrl);
            if (matcher.find()) {
                double latitude = Double.parseDouble(matcher.group(1));
                double longitude = Double.parseDouble(matcher.group(2));
                coordinates = new double[] { latitude, longitude };
            }
        }

        return coordinates;
    }

    private String getRedirectUrl(String shortUrl) throws Exception {
        URL url = new URL(shortUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setInstanceFollowRedirects(false);
        connection.connect();

        String redirectUrl = connection.getHeaderField("Location");
        connection.disconnect();
        return redirectUrl;
    }

    @Override
    public void updateData(SpotDto currentSpot, SpotDto spotDto) {
        Spot spot = spotRepository.findBySpotId(currentSpot.getSpotId()).orElseThrow(() -> new RuntimeException("Spot not found"));
        spot.setUser(spotDto.getUser());
        spot.setStatus(spotDto.getStatus());
        spot.setName(spotDto.getName());
        spot.setType(spotDto.getType());
        spot.setLocation(spotDto.getLocation());
        spot.setAddress(spotDto.getAddress());
        spot.setDescription(spotDto.getDescription());
        spot.setSizeWidth(spotDto.getSizeWidth());
        spot.setSizeLength(spotDto.getSizeLength());
        spot.setSizeHeight(spotDto.getSizeHeight());
        spot.setUpdatedAt(Instant.now());

        if (spotDto.getImageId() != null) {
            spot.setImageId(spotDto.getImageId());
        } else if (spotDto.getImageRemove() != null && spotDto.getImageRemove() == 1) {
            spot.setImageId(null);
        }

        spotRepository.save(spot);
    }

    @Override
    public void removeData(SpotDto currentSpot) {
        Spot spot = spotRepository.findBySpotId(currentSpot.getSpotId()).orElseThrow(() -> new RuntimeException("Spot not found"));
        spot.setStatus((short) 3);
        spot.setUpdatedAt(Instant.now());
        spotRepository.save(spot);
    }

    private SpotDto convertEntityToDto(Spot spot) {
        SpotDto spotDto = new SpotDto();
        spotDto.setSpotId(spot.getSpotId());
        spotDto.setUser(spot.getUser());
        spotDto.setStatus(spot.getStatus());
        spotDto.setName(spot.getName());
        spotDto.setType(spot.getType());
        spotDto.setLocation(spot.getLocation());
        spotDto.setLatitude(spot.getLatitude());
        spotDto.setLongitude(spot.getLongitude());
        spotDto.setAddress(spot.getAddress());
        spotDto.setDescription(spot.getDescription());
        spotDto.setSizeWidth(spot.getSizeWidth());
        spotDto.setSizeLength(spot.getSizeLength());
        spotDto.setSizeHeight(spot.getSizeHeight());
        spotDto.setImageId(spot.getImageId());
        spotDto.setCreatedAt(spot.getCreatedAt());
        spotDto.setUpdatedAt(spot.getUpdatedAt());

        User user = userRepository.findById(spot.getUser()).orElseThrow(() -> new RuntimeException("User not found"));
        spotDto.setUsername(user.getUsername());
        spotDto.setFirstName(user.getFirstName());
        spotDto.setLastName(user.getLastName());
        spotDto.setPhoneNumber(user.getPhoneNumber());

        if (user.getImageId() != null) {
            File userFile = fileRepository.findById(user.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

            if (userFile != null) {
                spotDto.setUserImagePath(userFile.getPath());
            }
        }

        if (spot.getImageId() != null) {
            File file = fileRepository.findById(spot.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

            if (file != null) {
                spotDto.setImagePath(file.getPath());
            }
        }

        return spotDto;
    }
}