package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.dto.response.CandidateResponse;
import com.example.ai_recruitment_platform.dto.response.PagedResponse;
import com.example.ai_recruitment_platform.entity.CandidateProfile;
import com.example.ai_recruitment_platform.exception.Exceptions.ResourceNotFoundException;
import com.example.ai_recruitment_platform.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateService {

    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public PagedResponse<CandidateResponse> getAllCandidates(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CandidateResponse> result = profileRepository.findAll(pageable).map(CandidateResponse::from);
        return PagedResponse.from(result);
    }

    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(Long id) {
        CandidateProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
        return CandidateResponse.from(profile);
    }

    @Transactional(readOnly = true)
    public CandidateResponse getCandidateByUserId(Long userId) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found for userId: " + userId));
        return CandidateResponse.from(profile);
    }
}
