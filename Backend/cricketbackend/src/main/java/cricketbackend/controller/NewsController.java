package cricketbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import cricketbackend.entity.News;
import cricketbackend.repository.NewsRepository;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsRepository newsRepository;

    public NewsController(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @GetMapping
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(
            @PathVariable Integer id) {

        return newsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public News addNews(@RequestBody News news) {
        return newsRepository.save(news);
    }

    @PutMapping("/{id}")
    public ResponseEntity<News> updateNews(
            @PathVariable Integer id,
            @RequestBody News updatedNews) {

        return newsRepository.findById(id)
                .map(news -> {
                    news.setTitle(updatedNews.getTitle());
                    news.setDescription(updatedNews.getDescription());
                    news.setImageUrl(updatedNews.getImageUrl());
                    news.setPublishedDate(updatedNews.getPublishedDate());

                    return ResponseEntity.ok(newsRepository.save(news));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(
            @PathVariable Integer id) {

        if (!newsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        newsRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}